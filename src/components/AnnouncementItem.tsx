import type { Announcement } from '../data/announcements';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function AnnouncementItem({ item }: { item: Announcement }) {
  return (
    <article className="py-4 border-b border-soft-border last:border-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-medium text-charcoal">{item.title}</h3>
        <time className="shrink-0 text-xs text-charcoal/70">
          {dateFmt.format(new Date(item.date))}
        </time>
      </div>
      <p className="mt-1 text-sm text-charcoal/70">{item.body}</p>
    </article>
  );
}
