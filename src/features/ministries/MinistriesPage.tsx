import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '../../components/SectionHeader';
import { MinistryCard } from '../../components/MinistryCard';
import { EmptyState } from '../../components/EmptyState';
import { getMinistries, type Ministry } from '../../data/ministries';

export default function MinistriesPage() {
  const { t } = useTranslation();
  const [ministries, setMinistries] = useState<Ministry[] | null>(null);

  useEffect(() => {
    void (async () => {
      setMinistries(await getMinistries());
    })();
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <SectionHeader
        level={1}
        title={t('ministries.title')}
        description={t('ministries.description')}
      />

      {ministries === null ? (
        <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
      ) : ministries.length === 0 ? (
        <EmptyState title={t('ministries.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <MinistryCard key={m.id} ministry={m} />
          ))}
        </div>
      )}
    </div>
  );
}
