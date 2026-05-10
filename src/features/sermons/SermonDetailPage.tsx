import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Headphones, Play, FileText, MessageCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import { getSermonById, type Sermon } from '../../data/sermons';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export default function SermonDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [sermon, setSermon] = useState<Sermon | null | undefined>(undefined);
  const [mediaOpen, setMediaOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!id) {
        setSermon(null);
        return;
      }
      setSermon((await getSermonById(id)) ?? null);
    })();
  }, [id]);

  if (sermon === undefined) {
    return <p className="py-8 text-sm text-charcoal/70">{t('common.loading')}</p>;
  }

  if (sermon === null) {
    return (
      <div className="py-10">
        <EmptyState
          title={t('sermons.notFound')}
          action={
            <Link to="/sermons" className="text-sm text-burgundy hover:underline">
              {t('sermons.backToSermons')}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-10 max-w-3xl">
      <Link
        to="/sermons"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('sermons.backToSermons')}
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge tone="burgundy">{sermon.scripture}</Badge>
          <span className="text-xs text-charcoal/70">
            {dateFmt.format(new Date(sermon.date))}
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-charcoal leading-tight">{sermon.title}</h1>
        <p className="mt-1 text-charcoal/70">{sermon.speaker}</p>
      </header>

      <p className="mt-6 text-charcoal/80 leading-relaxed">{sermon.summary}</p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => setMediaOpen(true)}>
          <Headphones size={16} aria-hidden="true" />
          {t('sermons.listen')}
        </Button>
        <Button variant="secondary" onClick={() => setMediaOpen(true)}>
          <Play size={16} aria-hidden="true" />
          {t('sermons.watch')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const el = document.getElementById('sermon-notes');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <FileText size={16} aria-hidden="true" />
          {t('sermons.viewNotes')}
        </Button>
        <span className="inline-block">
          <Button
            variant="ghost"
            disabled
            aria-disabled="true"
            title={t('sermons.askDisabledTooltip')}
          >
            <MessageCircle size={16} aria-hidden="true" />
            {t('sermons.ask')}
          </Button>
        </span>
      </div>

      {/* Notes */}
      <Card as="section" padding="lg" className="mt-8" id="sermon-notes">
        <h2 className="text-lg font-semibold text-charcoal mb-3">{t('sermons.notesHeading')}</h2>
        <p className="text-charcoal/80 leading-relaxed whitespace-pre-line">{sermon.notes}</p>
      </Card>

      <Modal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        title={t('sermons.media.modalTitle')}
        footer={
          <Button variant="secondary" onClick={() => setMediaOpen(false)}>
            {t('sermons.media.modalClose')}
          </Button>
        }
      >
        {t('sermons.media.modalBody')}
      </Modal>
    </div>
  );
}
