import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Card } from './Card';
import type { Ministry } from '../data/ministries';

export function MinistryCard({ ministry }: { ministry: Ministry }) {
  const { t } = useTranslation();
  return (
    <Card as="article" padding="md" className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-charcoal">{ministry.name}</h3>
      <p className="mt-1 text-sm text-charcoal/70 flex-1">{ministry.shortDescription}</p>
      <p className="mt-4 text-sm font-medium text-burgundy">{ministry.callToAction}</p>
      <div className="mt-4 pt-4 border-t border-soft-border">
        <Link
          to={`/ministries/${ministry.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:underline"
        >
          {t('common.learnMore')}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
