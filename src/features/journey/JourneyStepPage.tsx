import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { getJourneyStep, type JourneyStep } from '../../data/journey';

export default function JourneyStepPage() {
  const { step: stepId } = useParams();
  const { t } = useTranslation();
  const [step, setStep] = useState<JourneyStep | null | undefined>(undefined);

  useEffect(() => {
    void (async () => {
      if (!stepId) {
        setStep(null);
        return;
      }
      setStep((await getJourneyStep(stepId)) ?? null);
    })();
  }, [stepId]);

  if (step === undefined) {
    return <p className="py-8 text-sm text-charcoal/70">{t('common.loading')}</p>;
  }

  if (step === null) {
    return (
      <div className="py-10">
        <EmptyState
          title={t('journey.notFound')}
          action={
            <Link to="/journey" className="text-sm text-burgundy hover:underline">
              {t('journey.backToJourney')}
            </Link>
          }
        />
      </div>
    );
  }

  // If this step is configured to deep-link elsewhere, redirect.
  if (step.deepLinkTo) {
    return <Navigate to={step.deepLinkTo} replace />;
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl">
      <Link
        to="/journey"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('journey.backToJourney')}
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-semibold text-charcoal leading-tight">{step.title}</h1>
        <p className="mt-2 text-charcoal/70">{step.shortDescription}</p>
      </header>

      <Card as="section" padding="lg" className="mt-6">
        <h2 className="text-lg font-semibold text-charcoal mb-3">
          {t('journey.guidanceHeading')}
        </h2>
        <p className="text-charcoal/80 leading-relaxed">{step.guidance}</p>
      </Card>
    </div>
  );
}
