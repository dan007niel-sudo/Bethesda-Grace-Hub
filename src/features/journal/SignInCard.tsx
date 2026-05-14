import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FormField, FormGroup } from '../../components/FormField';
import { signInWithMagicLink } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';

type SignInCardProps = {
  redirectTo?: string;
};

export function SignInCard({ redirectTo }: SignInCardProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string>('');

  const configured = isSupabaseConfigured;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t('auth.errors.emailRequired'));
      return;
    }
    setError(null);
    setStatus('sending');
    try {
      const target =
        redirectTo ?? `${window.location.origin}/auth/callback`;
      await signInWithMagicLink(trimmed, target);
      setSentEmail(trimmed);
      setStatus('sent');
    } catch (err) {
      console.error('[auth] magic link error', err);
      setStatus('error');
      setError(t('auth.errors.sendFailed'));
    }
  }

  if (!configured) {
    return (
      <Card padding="md">
        <h2 className="text-base font-semibold text-charcoal mb-2">
          {t('auth.signInHeading')}
        </h2>
        <p className="text-sm text-charcoal/80 leading-relaxed">
          {t('auth.notConfigured')}
        </p>
      </Card>
    );
  }

  if (status === 'sent') {
    return (
      <Card padding="md">
        <h2 className="text-base font-semibold text-charcoal mb-2">
          {t('auth.sentTitle')}
        </h2>
        <p className="text-sm text-charcoal/80 leading-relaxed">
          {t('auth.sentBody', { email: sentEmail })}
        </p>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h2 className="text-base font-semibold text-charcoal mb-2">
        {t('auth.signInHeading')}
      </h2>
      <p className="text-sm text-charcoal/80 leading-relaxed mb-4">
        {t('auth.signInBody')}
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <FormField
            type="email"
            label={t('auth.emailLabel')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            error={error ?? undefined}
            disabled={status === 'sending'}
          />
        </FormGroup>
        <div className="mt-4">
          <Button type="submit" variant="primary" disabled={status === 'sending'}>
            <Mail size={16} aria-hidden="true" />
            {status === 'sending' ? t('auth.sending') : t('auth.sendLink')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
