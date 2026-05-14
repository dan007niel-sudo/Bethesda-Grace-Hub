import { useEffect, useState } from 'react';
import { getEvents, type ChurchEvent } from '../data/events';

export type LivePhase = 'soon' | 'live';

export type LiveServiceState = {
  event: ChurchEvent;
  phase: LivePhase;
  minutesUntilStart?: number;
};

const SOON_WINDOW_MS = 15 * 60_000;
const FALLBACK_DURATION_MS = 90 * 60_000;

export async function getLiveService(now: Date = new Date()): Promise<LiveServiceState | null> {
  const events = await getEvents();
  const nowMs = now.getTime();
  for (const event of events.slice(0, 6)) {
    const startMs = new Date(event.date).getTime();
    const endMs = event.endDate
      ? new Date(event.endDate).getTime()
      : startMs + FALLBACK_DURATION_MS;
    if (Number.isNaN(startMs) || Number.isNaN(endMs)) continue;
    if (startMs - SOON_WINDOW_MS <= nowMs && nowMs < startMs) {
      return {
        event,
        phase: 'soon',
        minutesUntilStart: Math.max(1, Math.ceil((startMs - nowMs) / 60_000)),
      };
    }
    if (startMs <= nowMs && nowMs <= endMs) {
      return { event, phase: 'live' };
    }
  }
  return null;
}

export function useLiveService(): LiveServiceState | null {
  const [state, setState] = useState<LiveServiceState | null>(null);

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      void getLiveService()
        .then((next) => {
          if (!cancelled) setState(next);
        })
        .catch(() => {
          if (!cancelled) setState(null);
        });
    };

    refresh();
    const interval = window.setInterval(refresh, 60_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return state;
}
