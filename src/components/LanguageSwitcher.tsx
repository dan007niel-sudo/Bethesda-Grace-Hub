import type { i18n as I18n } from 'i18next';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN', nameKey: 'common.langEnglish' },
  { code: 'de', label: 'DE', nameKey: 'common.langGerman' },
] as const;

function selectLanguage(i18n: I18n, lng: string) {
  void i18n.changeLanguage(lng);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('bgh-lang', lng);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div
      role="group"
      aria-label={t('common.changeLanguage')}
      className="flex items-center gap-1 text-xs"
    >
      {LANGUAGES.map(({ code, label, nameKey }, index) => {
        const isActive = current === code;
        return (
          <span key={code} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden="true" className="text-charcoal/70">
                ·
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => selectLanguage(i18n, code)}
              aria-pressed={isActive}
              aria-label={t(nameKey)}
              className={
                isActive
                  ? 'font-semibold text-burgundy'
                  : 'text-charcoal/70 hover:text-burgundy transition-colors'
              }
            >
              {label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
