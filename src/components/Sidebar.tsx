import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PRIMARY_NAV } from './Navigation';
import { Wordmark } from './Wordmark';
import { Logo } from './Logo';

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 border-r border-soft-border bg-white/60"
      aria-label={t('common.appName')}
    >
      <div className="px-6 py-6 border-b border-soft-border">
        <NavLink to="/" className="inline-flex items-center gap-2.5">
          <Logo size={36} decorative />
          <Wordmark size="md" />
        </NavLink>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {PRIMARY_NAV.map(({ to, labelKey, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-burgundy/10 text-burgundy'
                      : 'text-charcoal/75 hover:text-charcoal hover:bg-cream',
                  ].join(' ')
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{t(labelKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-soft-border flex items-center gap-4 text-xs text-charcoal/70">
        <NavLink to="/admin-preview" className="hover:text-burgundy">
          {t('nav.adminPreview')}
        </NavLink>
        <NavLink to="/legal" className="hover:text-burgundy">
          {t('legal.footerLink')}
        </NavLink>
      </div>
    </aside>
  );
}
