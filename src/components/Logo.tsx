import { useTranslation } from 'react-i18next';

type LogoProps = {
  size?: number;
  className?: string;
  decorative?: boolean;
};

export function Logo({ size = 96, className = '', decorative = false }: LogoProps) {
  const { t } = useTranslation();
  return (
    <img
      src="/logo.png"
      width={size}
      height={size}
      alt={decorative ? '' : t('common.appName')}
      aria-hidden={decorative || undefined}
      className={className}
      decoding="async"
      loading="eager"
    />
  );
}
