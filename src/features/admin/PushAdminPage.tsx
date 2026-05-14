import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormField, FormGroup } from '../../components/FormField';
import { Modal } from '../../components/Modal';
import NotFoundPage from '../../components/NotFoundPage';
import { useSession } from '../../lib/auth';
import { isAdminEmail } from '../../lib/admin';

const TITLE_MAX = 60;
const BODY_MAX = 200;

// Derive the send-push endpoint from VITE_AI_ENDPOINT (same pattern as
// devotional.ts) so a single Render env var configures all functions.
const AI_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SEND_PUSH_ENDPOINT = AI_ENDPOINT
  ? AI_ENDPOINT.replace(/\/chat$/, '/send-push')
  : undefined;

type SendResult = { sent: number; failed: number; removed?: number };

export default function PushAdminPage() {
  const { t } = useTranslation();
  const { session, loading } = useSession();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div
          role="status"
          aria-label={t('common.loading')}
          className="inline-flex h-10 w-10 rounded-full border-2 border-burgundy/30 border-t-burgundy animate-spin"
        />
      </div>
    );
  }

  if (!session || !isAdminEmail(session.user.email)) {
    return <NotFoundPage />;
  }

  function validate(): boolean {
    const next: { title?: string; body?: string } = {};
    const tTitle = title.trim();
    const tBody = body.trim();
    if (!tTitle) next.title = t('admin.push.errors.titleRequired');
    else if (tTitle.length > TITLE_MAX) next.title = t('admin.push.errors.titleTooLong');
    if (!tBody) next.body = t('admin.push.errors.bodyRequired');
    else if (tBody.length > BODY_MAX) next.body = t('admin.push.errors.bodyTooLong');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  }

  async function handleConfirmSend() {
    if (!SEND_PUSH_ENDPOINT) {
      setServerError(t('admin.push.errorGeneric'));
      setShowConfirm(false);
      return;
    }
    setSending(true);
    setServerError(null);
    setResult(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (ANON_KEY) headers.apikey = ANON_KEY;
      const token = session?.access_token;
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(SEND_PUSH_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('[push-admin] send failed', res.status, text);
        setServerError(t('admin.push.errorGeneric'));
        return;
      }
      const data = (await res.json()) as SendResult;
      setResult(data);
      setTitle('');
      setBody('');
      setUrl('');
    } catch (err) {
      console.error('[push-admin] send error', err);
      setServerError(t('admin.push.errorGeneric'));
    } finally {
      setSending(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl space-y-6">
      <SectionHeader
        level={1}
        title={t('admin.push.title')}
        description={t('admin.push.description')}
      />

      <Card padding="md">
        <form onSubmit={handleSubmit} noValidate>
          <FormGroup>
            <FormField
              label={t('admin.push.titleLabel')}
              placeholder={t('admin.push.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX + 20}
              required
              error={errors.title}
            />
            <FormField
              as="textarea"
              label={t('admin.push.bodyLabel')}
              placeholder={t('admin.push.bodyPlaceholder')}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={BODY_MAX + 50}
              required
              error={errors.body}
            />
            <FormField
              label={t('admin.push.urlLabel')}
              placeholder={t('admin.push.urlPlaceholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </FormGroup>
          <div className="mt-5">
            <Button type="submit" variant="primary" disabled={sending}>
              <Send size={16} aria-hidden="true" />
              {sending ? t('admin.push.sending') : t('admin.push.sendButton')}
            </Button>
          </div>
        </form>

        {result ? (
          <div className="mt-4 rounded-xl border border-soft-border bg-cream/60 p-3">
            <p className="text-sm font-medium text-charcoal">
              {t('admin.push.successTitle')}
            </p>
            <p className="text-xs text-charcoal/70 mt-1">
              {t('admin.push.success', { sent: result.sent, failed: result.failed })}
            </p>
          </div>
        ) : null}

        {serverError ? (
          <p role="alert" className="mt-4 text-sm text-burgundy">
            {serverError}
          </p>
        ) : null}
      </Card>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={t('admin.push.confirmTitle')}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              disabled={sending}
            >
              {t('admin.push.confirmCancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmSend}
              disabled={sending}
            >
              {sending ? t('admin.push.sending') : t('admin.push.confirmSend')}
            </Button>
          </>
        }
      >
        <p>{t('admin.push.confirmBody')}</p>
      </Modal>
    </div>
  );
}
