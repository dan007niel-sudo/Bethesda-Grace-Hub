import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { BookHeart, Send } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { PastoralNote } from '../../components/PastoralNote';
import { EmptyState } from '../../components/EmptyState';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormField, FormGroup } from '../../components/FormField';
import { useSession } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  addEntry,
  deleteEntry,
  listEntries,
  setAnswered,
} from '../../lib/prayerJournal';
import type { JournalEntry } from '../../lib/prayerJournal';
import { SignInCard } from './SignInCard';
import { JournalEntryCard } from './JournalEntryCard';

export default function JournalPage() {
  const { t } = useTranslation();
  const { session, loading: sessionLoading } = useSession();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  );
  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});
  const [topError, setTopError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState('loading');
    try {
      const data = await listEntries();
      setEntries(data);
      setLoadState('ready');
    } catch (err) {
      console.error('[journal] load error', err);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    if (session) {
      load();
    } else {
      setEntries([]);
      setLoadState('idle');
    }
  }, [session, load]);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      setBodyError(t('journal.errors.bodyRequired'));
      return;
    }
    setBodyError(null);
    setSubmitting(true);
    setTopError(null);
    try {
      const entry = await addEntry(trimmed);
      setEntries((prev) => [entry, ...prev]);
      setBody('');
    } catch (err) {
      console.error('[journal] add error', err);
      setTopError(t('journal.errors.saveFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleAnswered(entry: JournalEntry) {
    setBusyIds((s) => ({ ...s, [entry.id]: true }));
    setTopError(null);
    try {
      const updated = await setAnswered(entry.id, !entry.answered_at);
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? updated : e)));
    } catch (err) {
      console.error('[journal] toggle error', err);
      setTopError(t('journal.errors.updateFailed'));
    } finally {
      setBusyIds((s) => {
        const next = { ...s };
        delete next[entry.id];
        return next;
      });
    }
  }

  async function handleDelete(entry: JournalEntry) {
    setBusyIds((s) => ({ ...s, [entry.id]: true }));
    setTopError(null);
    try {
      await deleteEntry(entry.id);
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    } catch (err) {
      console.error('[journal] delete error', err);
      setTopError(t('journal.errors.deleteFailed'));
    } finally {
      setBusyIds((s) => {
        const next = { ...s };
        delete next[entry.id];
        return next;
      });
    }
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl space-y-6">
      <SectionHeader
        level={1}
        title={t('journal.title')}
        description={t('journal.description')}
      />

      <PastoralNote>{t('journal.pastoralNote')}</PastoralNote>

      {!isSupabaseConfigured ? (
        <Card padding="md">
          <h2 className="text-base font-semibold text-charcoal mb-2">
            {t('journal.notConfiguredTitle')}
          </h2>
          <p className="text-sm text-charcoal/80 leading-relaxed">
            {t('journal.notConfiguredBody')}
          </p>
        </Card>
      ) : sessionLoading ? (
        <Card padding="md">
          <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
        </Card>
      ) : !session ? (
        <SignInCard />
      ) : (
        <>
          <Card padding="md">
            <form onSubmit={handleAdd} noValidate>
              <FormGroup>
                <FormField
                  as="textarea"
                  label={t('journal.addLabel')}
                  placeholder={t('journal.addPlaceholder')}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  error={bodyError ?? undefined}
                  disabled={submitting}
                />
              </FormGroup>
              <div className="mt-4">
                <Button type="submit" variant="primary" disabled={submitting}>
                  <Send size={16} aria-hidden="true" />
                  {submitting ? t('journal.saving') : t('journal.addButton')}
                </Button>
              </div>
            </form>
          </Card>

          {topError ? (
            <p role="alert" className="text-sm text-burgundy">
              {topError}
            </p>
          ) : null}

          {loadState === 'loading' ? (
            <Card padding="md">
              <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
            </Card>
          ) : loadState === 'error' ? (
            <Card padding="md">
              <p className="text-sm text-burgundy">{t('journal.loadError')}</p>
            </Card>
          ) : entries.length === 0 ? (
            <EmptyState
              icon={<BookHeart size={20} aria-hidden="true" />}
              title={t('journal.emptyTitle')}
              description={t('journal.empty')}
            />
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onToggleAnswered={handleToggleAnswered}
                  onDelete={handleDelete}
                  busy={Boolean(busyIds[entry.id])}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
