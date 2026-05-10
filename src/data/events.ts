export type ChurchEvent = {
  id: string;
  title: string;
  date: string; // ISO datetime — start
  endDate?: string; // ISO datetime — end (optional)
  location: string;
  summary: string;
};

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

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
};

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
  },
  {
    id: 'bible-class',
    title: 'Bible Class',
    weekday: 2,
    startHour: 18,
    startMinute: 0,
    endHour: 19,
    endMinute: 30,
    location: 'Church premises',
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
    location: 'Church premises',
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
  },
  {
    id: 'sunday-service',
    title: 'Sunday Service',
    weekday: 0,
    startHour: 13,
    startMinute: 30,
    endHour: 15,
    endMinute: 30,
    location: 'Church premises',
    summary: 'Worship, teaching, and fellowship as the gathered church family.',
  },
];

function nextOccurrence(
  weekday: Weekday,
  hour: number,
  minute: number,
  from: Date,
): Date {
  const candidate = new Date(from);
  candidate.setSeconds(0, 0);
  const today = candidate.getDay();
  let daysUntil = (weekday - today + 7) % 7;
  // If it's the same weekday but the time has already passed today, push a week.
  const sameDayCandidate = new Date(candidate);
  sameDayCandidate.setHours(hour, minute, 0, 0);
  if (daysUntil === 0 && sameDayCandidate.getTime() <= from.getTime()) {
    daysUntil = 7;
  }
  candidate.setDate(candidate.getDate() + daysUntil);
  candidate.setHours(hour, minute, 0, 0);
  return candidate;
}

function isoLocal(d: Date): string {
  // Local-time ISO (no Z) so the same wall-clock hour is shown to the viewer.
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
  );
}

function buildUpcoming(count: number, from: Date = new Date()): ChurchEvent[] {
  return patterns
    .map((p) => {
      const start = nextOccurrence(p.weekday, p.startHour, p.startMinute, from);
      const end = new Date(start);
      end.setHours(p.endHour, p.endMinute, 0, 0);
      return {
        id: `${p.id}-${start.toISOString().slice(0, 10)}`,
        title: p.title,
        date: isoLocal(start),
        endDate: isoLocal(end),
        location: p.location,
        summary: p.summary,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export async function getEvents(): Promise<ChurchEvent[]> {
  return buildUpcoming(5);
}

/** Stable, presentation-friendly view of the recurring weekly rhythm — used by the Admin Preview. */
export function getWeeklySchedule(): Array<{
  weekday: string;
  time: string;
  title: string;
  location: string;
}> {
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fmt = (h: number, m: number) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  return patterns
    .slice()
    .sort((a, b) => {
      // Order Mon→Sun for human reading
      const ord = (w: Weekday) => (w === 0 ? 7 : w);
      return ord(a.weekday) - ord(b.weekday);
    })
    .map((p) => ({
      weekday: weekdayNames[p.weekday],
      time: `${fmt(p.startHour, p.startMinute)}–${fmt(p.endHour, p.endMinute)}`,
      title: p.title,
      location: p.location,
    }));
}
