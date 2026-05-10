import { useTranslation } from 'react-i18next';

type WordmarkProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Wordmark({ size = 'md' }: WordmarkProps) {
  const { t } = useTranslation();
  return (
    <span
      className={`font-ui font-semibold tracking-tight text-burgundy ${sizeMap[size]}`}
      aria-label={t('common.appName')}
    >
      {t('common.appName')}
    </span>
  );
}
