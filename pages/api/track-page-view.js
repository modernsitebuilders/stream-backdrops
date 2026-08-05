import { Redis } from '@upstash/redis';
import { shouldSkipAnalytics, isFloodingClient, isSuspectedBehavioralBot } from '../../lib/botFilter';
import { insertAnalyticsEventSafe } from '../../lib/neonEvents.mjs';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Block bots, headless browsers, HTTP-lib scrapers, and browser-UA spoofers
  // (shared gate for all 5 tracking endpoints — see lib/botFilter.js).
  if (shouldSkipAnalytics(req)) {
    return res.status(200).json({ success: true, skipped: 'bot' });
  }

  const {
    page,
    category,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    sessionId,
    originalReferrer,
    originalUtmSource,
    originalUtmMedium,
    originalUtmCampaign,
    landingPage,
    pageViewsInSession,
    downloadsInSession,
    visitorId,
    visitorType
  } = req.body;

  // Behavioral layer: drop a single client machine-gunning the same URL past
  // any human rate (catches real-Chromium bots the header layers can't — e.g.
  // the spoofed-google-referrer single-page flood). Safe no-op without Redis.
  if (await isFloodingClient(redis, req, page)) {
    return res.status(200).json({ success: true, skipped: 'flood' });
  }

  let currentSource = 'direct';
  if (utm_source) {
    currentSource = utm_source;
    if (utm_medium) currentSource += `/${utm_medium}`;
    if (utm_campaign) currentSource += `/${utm_campaign}`;
  } else if (referrer && referrer !== 'direct') {
    currentSource = referrer;
  }

  let originalSource = originalReferrer || 'direct';
  if (originalUtmSource) {
    originalSource = originalUtmSource;
    if (originalUtmMedium) originalSource += `/${originalUtmMedium}`;
    if (originalUtmCampaign) originalSource += `/${originalUtmCampaign}`;
  }

  const now = new Date();
  const row = [
    now.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    'page_view',
    originalSource,
    page,
    category || 'n/a',
    pageViewsInSession || 1,
    downloadsInSession || 0,
    visitorType || 'new',
    landingPage || '',
    sessionId || '',
    visitorId || 'unknown',
    now.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
    now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    req.headers['user-agent'] || 'unknown',
    currentSource,
  ];

  // Header-level behavioral-bot PRE-tag (Neon-only; never dropped — see botFilter.js).
  const isBot = isSuspectedBehavioralBot({ userAgent: row[13], referer: row[14] });
  try {
    await redis.rpush('analytics:queue', JSON.stringify(row));
    await insertAnalyticsEventSafe(row, { isBot }); // live mirror to Neon (safe no-op without DATABASE_URL)
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Page view queueing failed:', error.message);
    res.status(200).json({ success: false, error: error.message });
  }
}
