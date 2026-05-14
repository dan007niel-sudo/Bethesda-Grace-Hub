// Supabase Edge Function: scheduled reminder fan-out.
// pg_cron pings this every 10 minutes; the function looks at the Europe/
// Berlin clock, figures out whether any roster event is starting in
// ~30 min, and (if so) fans out a push to every subscriber. The
// `push_sent_log` table dedupes so we never double-send within the
// 10-minute matching window.
//
// Endpoint: POST {SUPABASE_URL}/functions/v1/cron-reminders
// Auth:     Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
// Response: { checked: number, triggered?: string[] }
//
// Deploy:
//   supabase functions deploy cron-reminders --no-verify-jwt
//
// The roster is duplicated from `src/data/events.ts`. When the schedule
// changes the source of truth (events.ts) and this list must both be
// updated — see CLAUDE.md "Lessons Learned" for the follow-up to lift
// this into a shared module.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { isPushConfigured, sendPushToAll } from '../_shared/webPush.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// 10-min cron + 5-min half-window = catches everything that starts in
// ~25–35 min from now. Slight overlap is fine; the dedupe log absorbs it.
const REMINDER_LEAD_MIN = 30;
const WINDOW_HALF_MIN = 5;

type RosterEntry = {
  id: string;
  title: string;
  body: string;
  weekday: number; // 0 = Sunday
  startHour: number;
  startMinute: number;
  biweekly?: { anchorISO: string }; // anchor date YYYY-MM-DD
  url?: string;
};

// Mirrors src/data/events.ts. Every weekly/biweekly gathering shown in
// the app gets a 30-min-before reminder.
const ROSTER: RosterEntry[] = [
  {
    id: 'sunday-service',
    title: 'Sunday Service starts in 30 min',
    body: "We're meeting at Langestr. 19A. See you there.",
    weekday: 0,
    startHour: 13,
    startMinute: 30,
  },
  {
    id: 'youth-service',
    title: 'Youth Service starts in 30 min',
    body: "We're meeting at Langestr. 19A. See you there.",
    weekday: 0,
    startHour: 11,
    startMinute: 0,
    biweekly: { anchorISO: '2026-05-17' },
  },
  {
    id: 'youth-prayers',
    title: 'Youth Prayers on Zoom in 30 min',
    body: 'Join the youth prayer call from wherever you are.',
    weekday: 1,
    startHour: 20,
    startMinute: 30,
  },
  {
    id: 'bible-class',
    title: 'Bible Class starts in 30 min',
    body: 'Mid-week teaching at Langestr. 19A.',
    weekday: 2,
    startHour: 18,
    startMinute: 0,
  },
  {
    id: 'midweek-prayers',
    title: 'Midweek Prayers start in 30 min',
    body: 'A time of prayer together at Langestr. 19A.',
    weekday: 3,
    startHour: 18,
    startMinute: 0,
  },
  {
    id: 'friday-prayers',
    title: 'Friday Prayers on Zoom in 30 min',
    body: 'Join the Friday prayer call from wherever you are.',
    weekday: 5,
    startHour: 18,
    startMinute: 0,
  },
];

serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Auth: only allow callers who present the service-role key. pg_cron
  // sends it; nothing else should.
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7)
    : '';
  if (!SUPABASE_SERVICE_ROLE_KEY || token !== SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Not authorized' }, 401);
  }

  if (!isPushConfigured()) {
    return json({ error: 'Push not configured on server' }, 500);
  }
  if (!SUPABASE_URL) {
    return json({ error: 'Supabase URL not configured' }, 500);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const now = new Date();
  const triggered: string[] = [];

  for (const entry of ROSTER) {
    const minutesUntil = minutesUntilNextOccurrence(entry, now);
    if (minutesUntil == null) continue;
    const diff = Math.abs(minutesUntil - REMINDER_LEAD_MIN);
    if (diff > WINDOW_HALF_MIN) continue;

    // Build the reminder_key from the Berlin date of the occurrence.
    const occurrenceDate = berlinDateForOccurrence(entry, now);
    const reminderKey = `${entry.id}:${occurrenceDate}`;

    // Insert; on conflict the dedupe log has a row already → skip.
    const { data: insertRows, error: insertError } = await adminClient
      .from('push_sent_log')
      .insert({ reminder_key: reminderKey, recipients_count: 0 })
      .select('id');
    if (insertError) {
      // 23505 = unique_violation → already sent, just skip.
      const code = (insertError as { code?: string }).code;
      if (code !== '23505') {
        console.error('[cron-reminders] insert failed', insertError);
      }
      continue;
    }
    if (!insertRows || insertRows.length === 0) continue;
    const logId = insertRows[0].id as string;

    try {
      const result = await sendPushToAll(adminClient, {
        title: entry.title,
        body: entry.body,
        url: entry.url ?? '/',
      });
      await adminClient
        .from('push_sent_log')
        .update({ recipients_count: result.sent })
        .eq('id', logId);
      triggered.push(entry.id);
    } catch (err) {
      console.error('[cron-reminders] fan-out failed for', entry.id, err);
    }
  }

  return json({ checked: ROSTER.length, triggered });
});

/**
 * Returns the integer minutes until this roster entry's next occurrence
 * (measured against `now` in Europe/Berlin), or null if not applicable.
 * Always returns a non-negative number — past today's start, we look
 * forward to the next weekly/biweekly slot.
 */
function minutesUntilNextOccurrence(entry: RosterEntry, now: Date): number | null {
  const berlin = berlinNowParts(now);
  // Build a candidate at today's local Berlin midnight + weekday delta.
  const todayWeekday = berlin.weekday;
  let daysUntil = (entry.weekday - todayWeekday + 7) % 7;
  const eventMinutesOfDay = entry.startHour * 60 + entry.startMinute;
  const nowMinutesOfDay = berlin.hour * 60 + berlin.minute;

  // If it's the right weekday but already past start, push to next week.
  if (daysUntil === 0 && nowMinutesOfDay > eventMinutesOfDay) {
    daysUntil = 7;
  }

  // Biweekly: skip a week if the candidate date is on the off-cycle.
  if (entry.biweekly) {
    const candidateDate = addBerlinDays(berlin.dateISO, daysUntil);
    const anchor = entry.biweekly.anchorISO;
    const diffDays = daysBetweenISO(anchor, candidateDate);
    if (((diffDays % 14) + 14) % 14 !== 0) {
      daysUntil += 7;
    }
  }

  const totalMinutes =
    daysUntil * 24 * 60 + (eventMinutesOfDay - nowMinutesOfDay);
  return totalMinutes;
}

function berlinDateForOccurrence(entry: RosterEntry, now: Date): string {
  const berlin = berlinNowParts(now);
  let daysUntil = (entry.weekday - berlin.weekday + 7) % 7;
  const eventMinutesOfDay = entry.startHour * 60 + entry.startMinute;
  const nowMinutesOfDay = berlin.hour * 60 + berlin.minute;
  if (daysUntil === 0 && nowMinutesOfDay > eventMinutesOfDay) {
    daysUntil = 7;
  }
  if (entry.biweekly) {
    const candidateDate = addBerlinDays(berlin.dateISO, daysUntil);
    const anchor = entry.biweekly.anchorISO;
    const diffDays = daysBetweenISO(anchor, candidateDate);
    if (((diffDays % 14) + 14) % 14 !== 0) {
      daysUntil += 7;
    }
  }
  return addBerlinDays(berlin.dateISO, daysUntil);
}

type BerlinParts = {
  dateISO: string; // YYYY-MM-DD
  weekday: number; // 0 = Sunday
  hour: number;
  minute: number;
};

function berlinNowParts(now: Date): BerlinParts {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = parseInt(get('hour'), 10);
  const minute = parseInt(get('minute'), 10);
  const weekdayShort = get('weekday');
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const weekday = weekdayMap[weekdayShort] ?? 0;
  return { dateISO: `${year}-${month}-${day}`, weekday, hour, minute };
}

function addBerlinDays(isoDate: string, days: number): string {
  // Anchor at noon Berlin to avoid DST edge-cases when shifting whole days.
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetweenISO(a: string, b: string): number {
  const da = new Date(`${a}T12:00:00Z`).getTime();
  const db = new Date(`${b}T12:00:00Z`).getTime();
  return Math.round((db - da) / 86400000);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
