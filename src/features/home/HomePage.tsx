import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, HandHeart, UsersRound, MapPin } from 'lucide-react';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';
import { Wordmark } from '../../components/Wordmark';
import { Logo } from '../../components/Logo';
import { EventItem } from '../../components/EventItem';
import { AnnouncementItem } from '../../components/AnnouncementItem';
import { ChurchMap } from '../../components/ChurchMap';
import { Directions } from '../../components/Directions';
import { getEvents, CHURCH_ADDRESS, type ChurchEvent } from '../../data/events';
import { getAnnouncements, type Announcement } from '../../data/announcements';
import { getDevotional, type Devotional } from '../../lib/devotional';

type QuickActionDef = {
  to: string;
  icon: typeof Sparkles;
  titleKey: string;
  subKey: string;
};

export default function HomePage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [devotional, setDevotional] = useState<Devotional | null>(null);

  useEffect(() => {
    void (async () => {
      const [evs, anns] = await Promise.all([getEvents(), getAnnouncements()]);
      setEvents(evs.slice(0, 6));
      setAnnouncements(anns.slice(0, 3));
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const d = await getDevotional();
        setDevotional(d);
      } catch (e) {
        // Silent fallback: the static hero verse stays visible.
        console.warn('Devotional unavailable, using static fallback:', e);
      }
    })();
  }, []);

  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const quickActions: QuickActionDef[] = [
    {
      to: '/assistant',
      icon: Sparkles,
      titleKey: 'home.quickActions.askAssistant',
      subKey: 'home.quickActions.askAssistantSub',
    },
    {
      to: '/prayer',
      icon: HandHeart,
      titleKey: 'home.quickActions.prayerRequest',
      subKey: 'home.quickActions.prayerRequestSub',
    },
    {
      to: '/connect',
      icon: UsersRound,
      titleKey: 'home.quickActions.connect',
      subKey: 'home.quickActions.connectSub',
    },
  ];

  return (
    <div className="py-8 lg:py-12 space-y-12">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto">
        <Logo size={128} className="mx-auto mb-4" decorative />
        <Wordmark size="lg" />
        <p className="mt-3 text-charcoal/70">{t('home.heroIntro')}</p>
        {devotional ? (
          <>
            <p className="mt-8 text-xs uppercase tracking-wide text-charcoal/70">
              <span className="inline-flex items-center rounded-full bg-burgundy/10 text-burgundy px-2 py-0.5 font-medium">
                {t('home.devotional.todayBadge')}
              </span>
              <span className="ml-2 text-charcoal/70 normal-case tracking-normal">
                {todayLabel}
              </span>
            </p>
            <blockquote className="mt-4 verse text-burgundy/85 text-lg leading-relaxed px-2">
              “{devotional.verse}”
            </blockquote>
            <p className="mt-2 text-sm text-charcoal/70">{devotional.reference}</p>
            <p className="mt-4 text-charcoal/80 max-w-xl mx-auto leading-relaxed">
              {devotional.reflection}
            </p>
          </>
        ) : (
          <>
            <blockquote className="mt-8 verse text-burgundy/85 text-lg leading-relaxed px-2">
              “{t('home.scriptureVerse')}”
            </blockquote>
            <p className="mt-2 text-sm text-charcoal/70">{t('home.scriptureRef')}</p>
          </>
        )}
        <p className="mt-8 text-charcoal/75 max-w-xl mx-auto">{t('home.welcome')}</p>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-xl font-semibold text-charcoal mb-4">
          {t('home.quickActions.title')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map(({ to, icon: Icon, titleKey, subKey }) => (
            <Link
              key={titleKey}
              to={to}
              className="group bg-white border border-soft-border rounded-card p-4 transition-colors hover:border-burgundy/40 hover:bg-cream/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-burgundy/10 text-burgundy mb-3">
                <Icon size={18} aria-hidden="true" />
              </div>
              <div className="font-medium text-charcoal text-sm leading-tight">{t(titleKey)}</div>
              <div className="mt-1 text-xs text-charcoal/70">{t(subKey)}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Events */}
      <section aria-labelledby="events-heading">
        <SectionHeader
          title={t('home.events.title')}
          description={t('home.events.description')}
        />
        {events.length === 0 ? (
          <EmptyState title={t('home.events.empty')} />
        ) : (
          <Card padding="sm">
            <div className="divide-y divide-soft-border">
              {events.map((e) => (
                <EventItem key={e.id} event={e} />
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Announcements */}
      <section aria-labelledby="announcements-heading">
        <SectionHeader
          title={t('home.announcements.title')}
          description={t('home.announcements.description')}
        />
        {announcements.length === 0 ? (
          <EmptyState title={t('home.announcements.empty')} />
        ) : (
          <Card padding="sm">
            <div className="divide-y divide-soft-border">
              {announcements.map((a) => (
                <AnnouncementItem key={a.id} item={a} />
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Find us */}
      <section aria-labelledby="find-us-heading">
        <SectionHeader title={t('home.findUs.title')} />
        <div className="space-y-4">
          <Card padding="md" className="flex items-start gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-burgundy/10 text-burgundy">
              <MapPin size={18} aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal">
                Bethesda Evangelical Church · House of Grace
              </p>
              <p className="text-sm text-charcoal/70 mt-0.5">{CHURCH_ADDRESS}</p>
            </div>
          </Card>
          <ChurchMap />
          <div>
            <h3 className="text-sm font-semibold text-charcoal mb-2">
              {t('home.findUs.directionsHeading')}
            </h3>
            <Directions />
          </div>
        </div>
      </section>
    </div>
  );
}
