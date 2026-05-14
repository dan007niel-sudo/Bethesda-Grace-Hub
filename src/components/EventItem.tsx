import { Calendar, MapPin, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChurchEvent } from '../data/events';
import type { LivePhase } from '../lib/liveService';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});
const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const monthAbbrFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });

export function EventItem({
  event,
  liveBadge,
}: {
  event: ChurchEvent;
  liveBadge?: LivePhase;
}) {
  const { t } = useTranslation();
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : null;
  const timeRange = end ? `${timeFmt.format(start)}–${timeFmt.format(end)}` : timeFmt.format(start);
  const badgeClass =
    liveBadge === 'live'
      ? 'bg-burgundy text-white'
      : 'bg-burgundy/15 text-burgundy';
  const badgeLabel =
    liveBadge === 'live'
      ? t('events.nowBadge')
      : liveBadge === 'soon'
        ? t('events.soonBadge')
        : null;
  return (
    <article className="flex items-start gap-4 py-4 border-b border-soft-border last:border-0">
      <div className="shrink-0 w-14 text-center">
        <div className="text-xs uppercase tracking-wide text-burgundy font-semibold">
          {monthAbbrFmt.format(start)}
        </div>
        <div className="text-2xl font-semibold text-charcoal leading-none">{start.getDate()}</div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-charcoal flex items-center gap-2 flex-wrap">
          <span>{event.title}</span>
          {badgeLabel ? (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badgeClass}`}
            >
              {badgeLabel}
            </span>
          ) : null}
        </h3>
        <p className="text-sm text-charcoal/70 mt-0.5">{event.summary}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/70">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} aria-hidden="true" />
            {dateFmt.format(start)} · {timeRange}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {event.location}
          </span>
        </div>
        {event.zoomUrl ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <a
              href={event.zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-burgundy text-white hover:bg-burgundy/90 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
            >
              <Video size={14} aria-hidden="true" />
              {t('home.events.joinZoom')}
            </a>
            {event.meetingCode ? (
              <span className="text-charcoal/70">
                {t('home.events.passcode')}:{' '}
                <span className="font-mono font-medium text-charcoal">{event.meetingCode}</span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
