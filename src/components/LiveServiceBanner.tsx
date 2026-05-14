import { useTranslation } from 'react-i18next';
import { MapPin, Video } from 'lucide-react';
import type { LiveServiceState } from '../lib/liveService';

export function LiveServiceBanner({ state }: { state: LiveServiceState }) {
  const { t } = useTranslation();
  const { event, phase } = state;
  const heading =
    phase === 'live'
      ? t('live.bannerLiveTitle', { title: event.title })
      : t('live.bannerSoonTitle', { title: event.title, minutes: state.minutesUntilStart ?? 0 });

  return (
    <section
      role="status"
      aria-live="polite"
      className="bg-burgundy text-white motion-safe:animate-pulse rounded-card p-5 lg:p-6"
    >
      <h2 className="text-lg lg:text-xl font-semibold leading-snug">{heading}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
        {event.location ? (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" />
            {t('live.bannerLocation', { location: event.location })}
          </span>
        ) : null}
        {event.zoomUrl ? (
          <a
            href={event.zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
          >
            <Video size={14} aria-hidden="true" />
            {t('live.bannerJoinZoom')}
          </a>
        ) : null}
      </div>
    </section>
  );
}
