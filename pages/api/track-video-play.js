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

  // Shared bot + browser-UA-spoofer gate (see lib/botFilter.js).
  if (shouldSkipAnalytics(req)) {
    return res.status(200).json({ success: true, skipped: 'bot' });
  }

  const {
    videoId,
    videoTitle,
    page,
    sessionId,
    originalReferrer,
    originalUtmSource,
    originalUtmMedium,
    originalUtmCampaign,
    landingPage,
    pageViewsInSession,
    downloadsInSession,
    visitorId,
    visitorType,
  } = req.body;

  // Behavioral velocity cap — keyed on the played video. Safe no-op without Redis.
  if (await isFloodingClient(redis, req, videoId || videoTitle)) {
    return res.status(200).json({ success: true, skipped: 'flood' });
  }

  let source = originalReferrer || 'direct';
  if (originalUtmSource) {
    source = originalUtmSource;
    if (originalUtmMedium) source += `/${originalUtmMedium}`;
    if (originalUtmCampaign) source += `/${originalUtmCampaign}`;
  }

  const now = new Date();
  const row = [
    now.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    'video_play',
    source,
    videoTitle || videoId || 'unknown',
    page || '/',
    pageViewsInSession || 0,
    downloadsInSession || 0,
    visitorType || 'new',
    landingPage || '',
    sessionId || '',
    visitorId || 'unknown',
    now.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
    now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    req.headers['user-agent'] || 'unknown',
    req.headers['referer'] || 'direct',
  ];

  const isBot = isSuspectedBehavioralBot({ userAgent: row[13], referer: row[14] });
  try {
    await redis.rpush('analytics:queue', JSON.stringify(row));
    await insertAnalyticsEventSafe(row, { isBot }); // live mirror to Neon (safe no-op without DATABASE_URL)
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Video play tracking failed:', error.message);
    res.status(200).json({ success: false, error: error.message });
  }
}
