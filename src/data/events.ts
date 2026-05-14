export type ChurchEvent = {
  id: string;
  title: string;
  date: string; // ISO datetime — start
  endDate?: string; // ISO datetime — end (optional)
  location: string;
  summary: string;
  zoomUrl?: string;
  meetingCode?: string;
};

export const ZOOM_URL = 'https://us04web.zoom.us/j/7532078373';
export const ZOOM_PASSCODE = '497658';

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

type Frequency = { kind: 'weekly' } | { kind: 'biweekly'; anchor: string }; // anchor: ISO date "YYYY-MM-DD" of any past or upcoming occurrence

type RecurringPattern = {
  id: string;
  title: string;
  weekday: Weekday;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  location: string;
  summary: string;
  frequency?: Frequency;
  zoom?: boolean;
};

export const CHURCH_ADDRESS = 'Langestr. 19A, 49080 Osnabrück';
export const CHURCH_COORDS = { lat: 52.269365, lng: 8.0397792 };
// Preserved verbatim from the church website. Note the `bes` (not `be`) — see
// CLAUDE.md "Lessons Learned > Content". Do not silently "fix" without confirmation.
export const CHURCH_EMAIL = 'besthesdahouseofgrace1010@gmail.com';

const patterns: RecurringPattern[] = [
  {
    id: 'youth-prayers',
    title: 'Youth Prayers on Zoom',
    weekday: 1,
    startHour: 20,
    startMinute: 30,
    endHour: 21,
    endMinute: 30,
    location: 'Online (Zoom)',
    summary: 'Weekly youth prayer gathering — open to all young people of the church.',
    zoom: true,
  },
  {
    id: 'bible-class',
    title: 'Bible Class',
    weekday: 2,
    startHour: 18,
    startMinute: 0,
    endHour: 19,
    endMinute: 30,
    location: CHURCH_ADDRESS,
    summary: 'Mid-week teaching and discussion in the Word.',
  },
  {
    id: 'midweek-prayers',
    title: 'Midweek Prayers',
    weekday: 3,
    startHour: 18,
    startMinute: 0,
    endHour: 19,
    endMinute: 30,
    location: CHURCH_ADDRESS,
    summary: 'A time of prayer together at church.',
  },
  {
    id: 'friday-prayers',
    title: 'Friday Prayers on Zoom',
    weekday: 5,
    startHour: 18,
    startMinute: 0,
    endHour: 19,
    endMinute: 30,
    location: 'Online (Zoom)',
    summary: 'Friday evening prayer — joining online from wherever you are.',
    zoom: true,
  },
  {
    id: 'youth-service',
    title: 'Youth Service',
    weekday: 0,
    startHour: 11,
    startMinute: 0,
    endHour: 12,
    endMinute: 30,
    location: CHURCH_ADDRESS,
    summary: 'A worship service led by and for the young people of the church. Every other Sunday.',
    // Anchor: 2026-05-17 is the next youth service — alternates from there.
    frequency: { kind: 'biweekly', anchor: '2026-05-17' },
  },
  {
    id: 'sunday-service',
    title: 'Sunday Service',
    weekday: 0,
    startHour: 13,
    startMinute: 30,
    endHour: 15,
    endMinute: 30,
    location: CHURCH_ADDRESS,
    summary: 'Worship, teaching, and fellowship as the gathered church family.',
  },
];

function nextWeeklyOccurrence(
  weekday: Weekday,
  hour: number,
  minute: number,
  from: Date,
): Date {
  const candidate = new Date(from);
  candidate.setSeconds(0, 0);
  const today = candidate.getDay();
  let daysUntil = (weekday - today + 7) % 7;
  const sameDayCandidate = new Date(candidate);
  sameDayCandidate.setHours(hour, minute, 0, 0);
  if (daysUntil === 0 && sameDayCandidate.getTime() <= from.getTime()) {
    daysUntil = 7;
  }
  candidate.setDate(candidate.getDate() + daysUntil);
  candidate.setHours(hour, minute, 0, 0);
  return candidate;
}

function nextBiweeklyOccurrence(
  weekday: Weekday,
  hour: number,
  minute: number,
  anchor: string,
  from: Date,
): Date {
  const next = nextWeeklyOccurrence(weekday, hour, minute, from);
  const anchorDate = new Date(`${anchor}T00:00:00`);
  const dayMs = 86400000;
  const dayStart = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  const diffDays = Math.round((dayStart(next) - dayStart(anchorDate)) / dayMs);
  const remainder = ((diffDays % 14) + 14) % 14;
  if (remainder !== 0) {
    next.setDate(next.getDate() + (14 - remainder));
  }
  return next;
}

function nextOccurrence(p: RecurringPattern, from: Date): Date {
  if (p.frequency?.kind === 'biweekly') {
    return nextBiweeklyOccurrence(p.weekday, p.startHour, p.startMinute, p.frequency.anchor, from);
  }
  return nextWeeklyOccurrence(p.weekday, p.startHour, p.startMinute, from);
}

function isoLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
  );
}

function buildUpcoming(count: number, from: Date = new Date()): ChurchEvent[] {
  return patterns
    .map((p) => {
      const start = nextOccurrence(p, from);
      const end = new Date(start);
      end.setHours(p.endHour, p.endMinute, 0, 0);
      return {
        id: `${p.id}-${start.toISOString().slice(0, 10)}`,
        title: p.title,
        date: isoLocal(start),
        endDate: isoLocal(end),
        location: p.location,
        summary: p.summary,
        zoomUrl: p.zoom ? ZOOM_URL : undefined,
        meetingCode: p.zoom ? ZOOM_PASSCODE : undefined,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export async function getEvents(): Promise<ChurchEvent[]> {
  return buildUpcoming(6);
}

/** Stable, presentation-friendly view of the recurring rhythm — used by the Admin Preview. */
export function getWeeklySchedule(): Array<{
  weekday: string;
  time: string;
  title: string;
  location: string;
  cadence: string;
}> {
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fmt = (h: number, m: number) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  return patterns
    .slice()
    .sort((a, b) => {
      const ord = (w: Weekday) => (w === 0 ? 7 : w);
      const dayDiff = ord(a.weekday) - ord(b.weekday);
      if (dayDiff !== 0) return dayDiff;
      return a.startHour - b.startHour;
    })
    .map((p) => ({
      weekday: weekdayNames[p.weekday],
      time: `${fmt(p.startHour, p.startMinute)}–${fmt(p.endHour, p.endMinute)}`,
      title: p.title,
      location: p.location,
      cadence: p.frequency?.kind === 'biweekly' ? 'Every 2 weeks' : 'Weekly',
    }));
}
