import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { Wordmark } from './Wordmark';
import { Logo } from './Logo';

export function AppShell() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex bg-cream text-charcoal">
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 border-b border-soft-border bg-cream/90 backdrop-blur">
          <div className="px-4 h-14 flex items-center">
            <NavLink to="/" className="inline-flex items-center gap-2">
              <Logo size={28} decorative />
              <Wordmark size="md" />
            </NavLink>
          </div>
        </header>
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 px-4 lg:px-10 pb-24 lg:pb-10 max-w-[64rem] w-full mx-auto"
        >
          <Outlet />
        </main>
        <footer className="lg:hidden text-center text-xs text-charcoal/70 pb-20">
          <NavLink to="/admin-preview" className="hover:text-burgundy">
            {t('nav.adminPreview')}
          </NavLink>
        </footer>
      </div>
      <BottomNav />
    </div>
  );
}
