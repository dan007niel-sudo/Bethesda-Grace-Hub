import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PRIMARY_NAV } from './Navigation';

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t('nav.home')}
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-soft-border bg-white/95 backdrop-blur"
    >
      <ul className="flex items-stretch justify-around px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        {PRIMARY_NAV.map(({ to, labelKey, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-lg text-[11px] font-medium transition-colors',
                  isActive ? 'text-burgundy' : 'text-charcoal/70 hover:text-charcoal',
                ].join(' ')
              }
            >
              <Icon size={20} aria-hidden="true" />
              <span>{t(labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
