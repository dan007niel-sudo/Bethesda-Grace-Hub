import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';

type Status = 'pending' | 'error';

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.error('[auth-callback] Supabase is not configured');
      setStatus('error');
      return;
    }
    if (loading) return;
    if (session) {
      navigate('/journal', { replace: true });
      return;
    }
    // Give the URL-fragment session detection a brief window to settle before
    // giving up — onAuthStateChange will retrigger this effect once the
    // session lands. If after the loading flag flips we still have no
    // session, the link was expired or invalid.
    const timer = window.setTimeout(() => {
      console.error('[auth-callback] no session after callback');
      setStatus('error');
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [session, loading, navigate]);

  if (status === 'error') {
    return (
      <div className="py-16 flex flex-col items-center text-center max-w-md mx-auto">
        <h1 className="text-lg font-semibold text-charcoal mb-2">
          {t('auth.callbackErrorTitle')}
        </h1>
        <p className="text-sm text-charcoal/80 leading-relaxed mb-6">
          {t('auth.callbackError')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
        >
          {t('auth.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 flex flex-col items-center text-center max-w-md mx-auto">
      <div
        role="status"
        aria-live="polite"
        className="inline-flex h-10 w-10 rounded-full border-2 border-burgundy/30 border-t-burgundy animate-spin mb-4"
      />
      <p className="text-sm text-charcoal/80">{t('auth.signingIn')}</p>
    </div>
  );
}
