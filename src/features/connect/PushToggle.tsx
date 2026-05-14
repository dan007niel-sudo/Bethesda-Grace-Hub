import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  isIOSStandaloneRequired,
  subscribeToPush,
  unsubscribeFromPush,
  useSubscriptionStatus,
} from '../../lib/push';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export function PushToggle() {
  const { t } = useTranslation();
  const { status, refresh } = useSubscriptionStatus();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnable() {
    setBusy(true);
    setError(null);
    try {
      await subscribeToPush();
      refresh();
    } catch (err) {
      console.error('[push] enable failed', err);
      setError(t('push.errorGeneric'));
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setBusy(true);
    setError(null);
    try {
      await unsubscribeFromPush();
      refresh();
    } catch (err) {
      console.error('[push] disable failed', err);
      setError(t('push.errorGeneric'));
    } finally {
      setBusy(false);
    }
  }

  // When the public key isn't configured, the lib reports `unsupported`.
  // Show a more specific copy so the user knows it's not their device.
  const notConfigured = status === 'unsupported' && !VAPID_PUBLIC_KEY;
  const iosNeedsInstall = status === 'unsupported' && isIOSStandaloneRequired();

  return (
    <Card padding="md">
      <h2 className="text-base font-semibold text-charcoal mb-1 flex items-center gap-2">
        <Bell size={16} aria-hidden="true" className="text-burgundy" />
        {t('push.heading')}
      </h2>
      <p className="text-sm text-charcoal/80 leading-relaxed mb-3">
        {t('push.description')}
      </p>

      {status === 'loading' ? (
        <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
      ) : null}

      {status === 'unsupported' ? (
        <p className="text-sm text-charcoal/70">
          {notConfigured
            ? t('push.toggleNotConfigured')
            : iosNeedsInstall
              ? t('push.toggleUnsupportedIos')
              : t('push.toggleUnsupported')}
        </p>
      ) : null}

      {status === 'denied' ? (
        <p className="text-sm text-charcoal/70">{t('push.toggleDenied')}</p>
      ) : null}

      {status === 'unsubscribed' ? (
        <Button
          type="button"
          variant="primary"
          onClick={handleEnable}
          disabled={busy}
        >
          <Bell size={16} aria-hidden="true" />
          {busy ? t('push.enabling') : t('push.toggleEnable')}
        </Button>
      ) : null}

      {status === 'subscribed' ? (
        <div className="space-y-2">
          <p className="text-sm text-charcoal/80">{t('push.toggleSubscribed')}</p>
          <p className="text-xs text-charcoal/70">{t('push.toggleHint')}</p>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDisable}
            disabled={busy}
          >
            <BellOff size={16} aria-hidden="true" />
            {busy ? t('push.disabling') : t('push.toggleDisable')}
          </Button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-xs text-burgundy">
          {error}
        </p>
      ) : null}
    </Card>
  );
}
