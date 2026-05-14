import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookHeart, Check, Clock, Mail, MapPin } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { PreviewNotice } from '../../components/PreviewNotice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CHURCH_ADDRESS, CHURCH_EMAIL } from '../../data/events';
import { useSession, signOut } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SignInCard } from '../journal/SignInCard';

// Indices in `connect.roadmapItems` that are now live (rendered with a check
// icon). Anything else stays on the "coming soon" bullet.
const LIVE_ROADMAP_INDICES = new Set<number>([0, 1]);

export default function ConnectPage() {
  const { t } = useTranslation();
  const { session, loading } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const roadmap = t('connect.roadmapItems', { returnObjects: true }) as string[];

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('[connect] sign-out error', err);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="py-8 lg:py-10 max-w-2xl space-y-6">
      <SectionHeader
        level={1}
        title={t('connect.title')}
        description={t('connect.description')}
      />

      {!session ? (
        <PreviewNotice>{t('connect.comingSoonBadgeSignedOut')}</PreviewNotice>
      ) : null}

      {isSupabaseConfigured ? (
        loading ? (
          <Card padding="md">
            <p className="text-sm text-charcoal/70">{t('common.loading')}</p>
          </Card>
        ) : session ? (
          <Card padding="md">
            <h2 className="text-base font-semibold text-charcoal mb-2">
              {t('auth.signedInHeading')}
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              {t('auth.signedInAs', { email: session.user.email ?? '' })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/journal"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
              >
                <BookHeart size={16} aria-hidden="true" />
                {t('auth.openJournal')}
              </Link>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? t('auth.signingOut') : t('auth.signOut')}
              </Button>
            </div>
          </Card>
        ) : (
          <SignInCard />
        )
      ) : null}

      <Card padding="md">
        <h2 className="text-base font-semibold text-charcoal mb-3">
          {t('connect.roadmapHeading')}
        </h2>
        <ul className="space-y-2 text-sm text-charcoal/80">
          {roadmap.map((item, index) => {
            const live = LIVE_ROADMAP_INDICES.has(index);
            return (
              <li key={item} className="flex gap-2 items-start">
                {live ? (
                  <Check
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-burgundy"
                  />
                ) : (
                  <span aria-hidden="true" className="text-burgundy">•</span>
                )}
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card padding="md">
        <h2 className="text-base font-semibold text-charcoal mb-2">
          {t('connect.contactHeading')}
        </h2>
        <p className="text-sm text-charcoal/80 leading-relaxed">{t('connect.contactBody')}</p>
        <a
          href={`mailto:${CHURCH_EMAIL}`}
          className="mt-3 inline-flex items-center gap-2 text-sm text-burgundy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 rounded"
        >
          <Mail size={16} aria-hidden="true" />
          {CHURCH_EMAIL}
        </a>
      </Card>

      <Card padding="md">
        <h2 className="text-base font-semibold text-charcoal mb-3">
          {t('connect.addressHeading')}
        </h2>
        <div className="space-y-2 text-sm text-charcoal/80">
          <p className="flex items-start gap-2">
            <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-burgundy" />
            <span>{CHURCH_ADDRESS}</span>
          </p>
          <p className="flex items-start gap-2">
            <Clock size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-burgundy" />
            <span>{t('connect.serviceTime')}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
