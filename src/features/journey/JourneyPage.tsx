import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from '../../components/SectionHeader';
import { JourneyCard } from '../../components/JourneyCard';
import { EmptyState } from '../../components/EmptyState';
import { getJourneySteps, type JourneyStep } from '../../data/journey';

export default function JourneyPage() {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<JourneyStep[] | null>(null);

  useEffect(() => {
    void (async () => {
      setSteps(await getJourneySteps());
    })();
  }, []);

  return (
    <div className="py-8 lg:py-10">
      <SectionHeader
        level={1}
        title={t('journey.title')}
        description={t('journey.description')}
      />

      {steps === null ? (
        <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
      ) : steps.length === 0 ? (
        <EmptyState title={t('journey.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <JourneyCard key={s.id} step={s} />
          ))}
        </div>
      )}
    </div>
  );
}
