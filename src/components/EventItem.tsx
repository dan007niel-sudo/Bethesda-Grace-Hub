import { Calendar, MapPin } from 'lucide-react';
import type { ChurchEvent } from '../data/events';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});
const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

export function EventItem({ event }: { event: ChurchEvent }) {
  const d = new Date(event.date);
  return (
    <article className="flex items-start gap-4 py-4 border-b border-soft-border last:border-0">
      <div className="shrink-0 w-14 text-center">
        <div className="text-xs uppercase tracking-wide text-burgundy font-semibold">
          {dateFmt.format(d).split(',')[1]?.trim().split(' ')[0]}
        </div>
        <div className="text-2xl font-semibold text-charcoal leading-none">{d.getDate()}</div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-charcoal">{event.title}</h3>
        <p className="text-sm text-charcoal/70 mt-0.5">{event.summary}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/70">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} aria-hidden="true" />
            {dateFmt.format(d)} · {timeFmt.format(d)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" />
            {event.location}
          </span>
        </div>
      </div>
    </article>
  );
}
