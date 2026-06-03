// Local-only progress for the Bible Reading Plan. Completed days and the
// derived streak live entirely in localStorage — no backend, no Supabase, no
// auth. This keeps the feature fully usable in visitor/demo mode and offline,
// since it changes no church data and sends nothing.

export const READING_PROGRESS_KEY = 'bethesda-grace-hub-reading-progress';

export function getCompletedDays(): number[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(READING_PROGRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n) => Number.isInteger(n) && n >= 0);
  } catch {
    return [];
  }
}

export function toggleDay(index: number): number[] {
  const current = getCompletedDays();
  if (typeof window === 'undefined') return current;

  const set = new Set(current);
  if (set.has(index)) {
    set.delete(index);
  } else {
    set.add(index);
  }
  const next = [...set].sort((a, b) => a - b);

  try {
    window.localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode, quota) — keep the in-memory set.
  }

  return next;
}

export function currentStreak(completed: number[]): number {
  const set = new Set(completed);
  let streak = 0;
  while (set.has(streak)) {
    streak += 1;
  }
  return streak;
}
