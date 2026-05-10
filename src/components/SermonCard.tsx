import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { Badge } from './Badge';
import type { Sermon } from '../data/sermons';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function SermonCard({ sermon }: { sermon: Sermon }) {
  const { t } = useTranslation();
  return (
    <Card as="article" padding="md" className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <Badge tone="burgundy">{sermon.scripture}</Badge>
        <span className="text-xs text-charcoal/70">
          {dateFmt.format(new Date(sermon.date))}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-charcoal leading-snug">{sermon.title}</h3>
      <p className="text-sm text-charcoal/70 mt-0.5">{sermon.speaker}</p>
      <p className="text-sm text-charcoal/75 mt-3 line-clamp-3">{sermon.summary}</p>
      <div className="mt-4 pt-4 border-t border-soft-border">
        <Link
          to={`/sermons/${sermon.id}`}
          className="inline-flex items-center text-sm font-medium text-burgundy hover:underline"
        >
          {t('common.learnMore')}
        </Link>
      </div>
    </Card>
  );
}
