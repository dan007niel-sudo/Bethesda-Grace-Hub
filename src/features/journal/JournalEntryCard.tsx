import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, RotateCcw, Trash2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Modal } from '../../components/Modal';
import type { JournalEntry } from '../../lib/prayerJournal';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

type Props = {
  entry: JournalEntry;
  onToggleAnswered: (entry: JournalEntry) => void | Promise<void>;
  onDelete: (entry: JournalEntry) => void | Promise<void>;
  busy?: boolean;
};

export function JournalEntryCard({ entry, onToggleAnswered, onDelete, busy }: Props) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const answered = Boolean(entry.answered_at);
  const created = new Date(entry.created_at);
  const answeredOn = entry.answered_at ? new Date(entry.answered_at) : null;

  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs uppercase tracking-wide text-burgundy font-semibold">
              {dateFmt.format(created)}
            </span>
            {answered && answeredOn ? (
              <Badge tone="gold">
                <Check size={12} aria-hidden="true" />
                {t('journal.answeredBadge', { date: dateFmt.format(answeredOn) })}
              </Badge>
            ) : null}
          </div>
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap ${
              answered ? 'text-charcoal/70' : 'text-charcoal/85'
            }`}
          >
            {entry.body}
          </p>
        </div>
        <IconButton
          label={t('journal.delete')}
          size="sm"
          onClick={() => setConfirmOpen(true)}
          disabled={busy}
        >
          <Trash2 size={16} aria-hidden="true" />
        </IconButton>
      </div>
      <div className="mt-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onToggleAnswered(entry)}
          disabled={busy}
        >
          {answered ? (
            <>
              <RotateCcw size={14} aria-hidden="true" />
              {t('journal.markNotAnswered')}
            </>
          ) : (
            <>
              <Check size={14} aria-hidden="true" />
              {t('journal.markAnswered')}
            </>
          )}
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('journal.deleteConfirmTitle')}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
            >
              {t('journal.deleteCancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={async () => {
                setConfirmOpen(false);
                await onDelete(entry);
              }}
            >
              {t('journal.deleteConfirm')}
            </Button>
          </>
        }
      >
        {t('journal.deleteConfirmBody')}
      </Modal>
    </Card>
  );
}
