-- 006_analytics_is_bot.sql
-- Behavioral-bot flag for analytics_events.
--
-- Context: the Aug 2026 sessions/visitors "spike" was ~85–90% one behavioral
-- crawler (desktop-Linux X11 Chrome UA, exactly one page_view per fresh session,
-- spoofed google.com referer). It sends a clean modern-Chrome UA and one event
-- per session, so it slips past every layer in lib/botFilter.js (header token
-- match, spoofed-Chromium heuristic, per-IP/path velocity cap). The only reliable
-- separator from a real visitor is BEHAVIOR (session depth + zero engagement),
-- which is an aggregate signal — not knowable at single-event ingest time.
--
-- So we TAG rather than drop: every event carries is_bot, defaulting false.
--   * Ingest (lib/neonEvents.mjs) sets a fast header-level PRE-tag.
--   * scripts/data-platform/flag-bots.mjs is the AUTHORITATIVE, re-runnable
--     classifier — it promotes rows to is_bot=true from the session-level
--     fingerprint. It only ever promotes (false→true), never demotes, so a
--     pre-tag is never lost and a real ENGAGED session (≥2 events or a download)
--     is never flagged.
-- Dashboards (scripts/data-platform/insights.mjs) filter `WHERE NOT is_bot`.
--
-- Tagging (not deleting) keeps the data zero-loss and any false positive fully
-- recoverable with a manual UPDATE. is_bot is Neon-only — it is NOT a Google
-- Sheet column, so it does not affect row_hash or the sheet-sync dedup.

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS is_bot boolean NOT NULL DEFAULT false;

-- Partial index: the hot path is "real traffic only" (WHERE NOT is_bot), so index
-- exactly those rows. Keeps the common dashboard scans cheap without indexing the
-- bot rows we're excluding.
CREATE INDEX IF NOT EXISTS analytics_events_human_event_at_idx
  ON analytics_events (event_at)
  WHERE is_bot = false;
