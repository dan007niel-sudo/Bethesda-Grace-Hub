import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from './SectionHeader';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="py-12 lg:py-16 max-w-xl">
      <SectionHeader level={1} title={t('notFound.title')} description={t('notFound.description')} />
      <Link
        to="/"
        className="inline-flex items-center text-sm text-burgundy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 rounded"
      >
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}
