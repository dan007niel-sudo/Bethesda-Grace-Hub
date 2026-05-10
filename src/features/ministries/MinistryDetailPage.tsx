import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock } from 'lucide-react';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PreviewNotice } from '../../components/PreviewNotice';
import { getMinistryById, type Ministry } from '../../data/ministries';

export default function MinistryDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [ministry, setMinistry] = useState<Ministry | null | undefined>(undefined);

  useEffect(() => {
    void (async () => {
      if (!id) {
        setMinistry(null);
        return;
      }
      setMinistry((await getMinistryById(id)) ?? null);
    })();
  }, [id]);

  if (ministry === undefined) {
    return <p className="py-8 text-sm text-charcoal/70">{t('common.loading')}</p>;
  }

  if (ministry === null) {
    return (
      <div className="py-10">
        <EmptyState
          title={t('ministries.notFound')}
          action={
            <Link to="/ministries" className="text-sm text-burgundy hover:underline">
              {t('ministries.backToMinistries')}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-10 max-w-3xl">
      <Link
        to="/ministries"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('ministries.backToMinistries')}
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-semibold text-charcoal leading-tight">{ministry.name}</h1>
        <p className="mt-2 text-burgundy font-medium">{ministry.callToAction}</p>
      </header>

      <p className="mt-6 text-charcoal/80 leading-relaxed">{ministry.longDescription}</p>

      <Card as="section" padding="md" className="mt-6">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-burgundy/10 text-burgundy shrink-0">
            <Clock size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-medium text-charcoal">{t('ministries.timeCommitmentHeading')}</h2>
            <p className="mt-1 text-sm text-charcoal/75">{ministry.timeCommitment}</p>
          </div>
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="font-medium text-charcoal mb-2">{t('ministries.contactHeading')}</h2>
        <PreviewNotice>{ministry.contactPlaceholder}</PreviewNotice>
      </section>
    </div>
  );
}
