import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { SermonCard } from '../../components/SermonCard';
import { EmptyState } from '../../components/EmptyState';
import { getSermons, type Sermon } from '../../data/sermons';

export default function SermonsPage() {
  const { t } = useTranslation();
  const [sermons, setSermons] = useState<Sermon[] | null>(null);

  useEffect(() => {
    void (async () => {
      setSermons(await getSermons());
    })();
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <SectionHeader
        level={1}
        title={t('sermons.title')}
        description={t('sermons.description')}
      />

      {/* Search placeholder — visual only */}
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-soft-border bg-white px-3.5 py-2.5">
        <Search size={16} className="text-charcoal/40" aria-hidden="true" />
        <input
          type="search"
          disabled
          placeholder={t('sermons.searchPlaceholder')}
          aria-label={t('sermons.searchPlaceholder')}
          className="flex-1 bg-transparent text-sm placeholder:text-charcoal/40 disabled:cursor-not-allowed focus:outline-none"
        />
      </div>

      {sermons === null ? (
        <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
      ) : sermons.length === 0 ? (
        <EmptyState title={t('sermons.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((s) => (
            <SermonCard key={s.id} sermon={s} />
          ))}
        </div>
      )}
    </div>
  );
}
