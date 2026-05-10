import { useTranslation } from 'react-i18next';

type PagePlaceholderProps = {
  titleKey: string;
  descriptionKey?: string;
};

export function PagePlaceholder({ titleKey, descriptionKey }: PagePlaceholderProps) {
  const { t } = useTranslation();
  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold text-charcoal">{t(titleKey)}</h1>
      {descriptionKey ? (
        <p className="mt-3 text-charcoal/70 max-w-prose">{t(descriptionKey)}</p>
      ) : null}
    </section>
  );
}
