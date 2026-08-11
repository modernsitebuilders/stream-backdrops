import Stripe from 'stripe';
import { Redis } from '@upstash/redis';
import { insertAnalyticsEventSafe } from '../../lib/neonEvents.mjs';

const isTest = process.env.STRIPE_MODE === 'test';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Record a completed HD purchase as an `hd_purchase` analytics event — the same
// 15-column row shape pages/api/analytics.js writes — straight from the webhook.
//
// WHY here and not only on the /hd-download success page: the client-side write
// fires only if the buyer returns to /hd-download AND their browser lets the
// /api/analytics beacon through. Ad/privacy blockers (which block paths named
// "analytics") and closed tabs silently drop it, so real, paid sales went
// unrecorded (e.g. the 2026-08-11 sale). Stripe retries this webhook until it gets
// a 200, server-side, so it's the reliable, ad-blocker-proof record.
//
// Dedup: the row timestamp is derived from the Stripe session's `created` time (not
// wall-clock now), so a webhook redelivery produces a byte-identical row → identical
// row_hash → ON CONFLICT (row_hash) DO NOTHING no-ops it. The buyer's attribution
// rides in on session.metadata (a_sid/a_vid/a_src/... set by create-checkout.js).
async function recordHdPurchase(session, productIds) {
  try {
    const m = session?.metadata || {};
    // ET wall-clock string matching the format pages/api/analytics.js writes, built
    // from the Stripe session creation instant so it's stable across redeliveries.
    const created = session?.created ? new Date(session.created * 1000) : new Date();
    const et = (opts) => created.toLocaleString('en-US', { timeZone: 'America/New_York', ...opts });
    const row = [
      et({ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      'hd_purchase',
      m.a_src || 'direct',
      productIds.join(','),
      'hd',
      m.a_pv != null ? parseInt(m.a_pv, 10) || 0 : 0,
      0,
      m.a_vtype || 'new',
      m.a_land || '',
      m.a_sid || '',
      m.a_vid || 'unknown',
      created.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
      created.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      'stripe-webhook',
      'stripe-webhook',
    ];
    // Queue for the Sheet (system of record) + live-mirror to Neon, exactly like
    // pages/api/analytics.js. Both dedup on the shared cell-hash, so the daily
    // sheet→Neon reconciliation won't double-insert.
    await redis.rpush('analytics:queue', JSON.stringify(row));
    await insertAnalyticsEventSafe(row);
  } catch (e) {
    // Never let analytics recording break the 200 we owe Stripe.
    console.error('[stripe-webhook] hd_purchase recording failed:', e?.message);
  }
}

const stripe = new Stripe(
  isTest
    ? process.env.STRIPE_SECRET_KEY_TEST
    : process.env.STRIPE_SECRET_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

// Reassemble the full product-id list from the numbered metadata keys written
// by create-checkout.js (product_ids, product_ids_2, product_ids_3, …). The
// chunks are contiguous, so stop at the first missing key.
function reassembleProductIds(metadata) {
  const parts = [];
  for (let i = 1; ; i++) {
    const key = i === 1 ? 'product_ids' : `product_ids_${i}`;
    const value = metadata[key];
    if (value == null) break;
    parts.push(value);
  }
  return parts
    .join(',')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;

  try {
    const rawBody = await getRawBody(req);

    // 🧠 SAFE MODE SWITCH (TEST vs LIVE) — must match the Stripe key mode above.
    const webhookSecret = isTest
      ? process.env.STRIPE_WEBHOOK_SECRET_TEST
      : process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        '[stripe-webhook] Missing webhook secret env var for mode:',
        isTest ? 'test' : 'live'
      );
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );

  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).json({
      error: `Webhook signature invalid: ${err.message}`,
    });
  }

  // Only handle successful checkout sessions
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const metadata = session?.metadata;

  // 🛡️ Cross-site safety gate: ignore events from other sites on the shared Stripe account.
  // Every MeetBackdrops checkout sets metadata.site = 'streambackdrops'.
  if (!metadata || metadata.site !== 'streambackdrops') {
    console.log('[stripe-webhook] Ignored — not a MeetBackdrops event.', {
      session_id: session.id,
      site: metadata?.site ?? '(missing)',
    });
    return res.status(200).json({ received: true, ignored: true });
  }

  // Subscription checkouts are acknowledged here; lifecycle handling lives elsewhere.
  if (metadata.product_type === 'subscription') {
    console.log('[stripe-webhook] Subscription checkout acknowledged:', {
      session_id: session.id,
      customer: session.customer,
    });
    return res.status(200).json({ received: true });
  }

  // HD image purchase path
  if (metadata.product_type !== 'hd_image' || !metadata.product_ids) {
    console.log('[stripe-webhook] Ignored — unknown product_type for MeetBackdrops.', {
      session_id: session.id,
      product_type: metadata.product_type ?? '(missing)',
      product_ids: metadata.product_ids ?? '(missing)',
    });
    return res.status(200).json({ received: true, ignored: true });
  }

  // product_ids is a comma-joined string set by create-checkout.js. Large
  // bundles (10-/20-packs) exceed Stripe's 500-char metadata-value cap, so the
  // list is split across contiguous numbered keys: product_ids, product_ids_2,
  // product_ids_3, … Reassemble them in order before parsing (must stay in sync
  // with productIdMetadata() in create-checkout.js).
  const productIds = reassembleProductIds(metadata);

  if (productIds.length === 0) {
    console.error('[stripe-webhook] Empty product_ids after parse:', metadata.product_ids);
    return res.status(400).json({ error: 'Invalid product_ids format' });
  }

  console.log('[stripe-webhook] HD image purchase verified:', {
    session_id: session.id,
    product_ids: productIds,
  });

  // 📊 Record the sale server-side (reliable; not dependent on the buyer returning
  // to /hd-download or their browser allowing the analytics beacon through).
  await recordHdPurchase(session, productIds);

  // 🔓 Unlock each purchased HD image
  for (const id of productIds) {
    console.log('Unlock HD:', id);

    // TODO: persist entitlement
    // Example:
    // await db.purchases.create({
    //   session_id: session.id,
    //   product_id: id,
    //   paid_at: new Date(),
    // });
  }

  return res.status(200).json({ received: true });
}