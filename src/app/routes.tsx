import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import HomePage from '../features/home/HomePage';
import AssistantPage from '../features/assistant/AssistantPage';
import PrayerPage from '../features/prayer/PrayerPage';
import ConnectPage from '../features/connect/ConnectPage';
import AdminPreviewPage from '../features/admin/AdminPreviewPage';
import AdminSectionPage from '../features/admin/AdminSectionPage';
import ComponentShowcasePage from '../features/dev/ComponentShowcasePage';
import LegalPage from '../features/legal/LegalPage';
import NotFoundPage from '../components/NotFoundPage';

// Lazy-load auth/journal so the supabase-js client (~200 kB gz) only ships to
// users who actually open the journal or land on the magic-link callback.
const JournalPage = lazy(() => import('../features/journal/JournalPage'));
const AuthCallbackPage = lazy(() => import('../features/auth/AuthCallbackPage'));
const PushAdminPage = lazy(() => import('../features/admin/PushAdminPage'));

function RouteLoading() {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div
        role="status"
        aria-label="Loading"
        className="inline-flex h-10 w-10 rounded-full border-2 border-burgundy/30 border-t-burgundy animate-spin"
      />
    </div>
  );
}

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteLoading />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/assistant', element: <AssistantPage /> },
      { path: '/prayer', element: <PrayerPage /> },
      { path: '/journal', element: lazyRoute(<JournalPage />) },
      { path: '/auth/callback', element: lazyRoute(<AuthCallbackPage />) },
      { path: '/connect', element: <ConnectPage /> },
      { path: '/admin-preview', element: <AdminPreviewPage /> },
      { path: '/admin-preview/:section', element: <AdminSectionPage /> },
      { path: '/admin/push', element: lazyRoute(<PushAdminPage />) },
      { path: '/dev/components', element: <ComponentShowcasePage /> },
      { path: '/legal', element: <LegalPage /> },
      { path: '/legal/:doc', element: <LegalPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
