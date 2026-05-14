import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, loading } = useSession();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.error('[auth-callback] Supabase is not configured');
      navigate('/', { replace: true });
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
      navigate('/', { replace: true });
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [session, loading, navigate]);

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
