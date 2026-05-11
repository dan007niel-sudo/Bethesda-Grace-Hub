import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Clock } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader';
import { PreviewNotice } from '../../components/PreviewNotice';
import { Card } from '../../components/Card';
import { CHURCH_ADDRESS } from '../../data/events';

const CHURCH_EMAIL = 'besthesdahouseofgrace1010@gmail.com';

export default function ConnectPage() {
  const { t } = useTranslation();
  const roadmap = t('connect.roadmapItems', { returnObjects: true }) as string[];

  return (
    <div className="py-8 lg:py-10 max-w-2xl space-y-6">
      <SectionHeader
        level={1}
        title={t('connect.title')}
        description={t('connect.description')}
      />

      <PreviewNotice>{t('connect.comingSoonBadge')}</PreviewNotice>

      <Card padding="md">
        <h2 className="text-base font-semibold text-charcoal mb-3">
          {t('connect.roadmapHeading')}
        </h2>
        <ul className="space-y-2 text-sm text-charcoal/80">
          {roadmap.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="text-burgundy">•</span>
              <span>{item}</span>
            </li>
          ))}
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
