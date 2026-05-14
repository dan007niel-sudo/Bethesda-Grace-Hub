import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import HomePage from '../features/home/HomePage';
import AssistantPage from '../features/assistant/AssistantPage';
import PrayerPage from '../features/prayer/PrayerPage';
import JournalPage from '../features/journal/JournalPage';
import AuthCallbackPage from '../features/auth/AuthCallbackPage';
import ConnectPage from '../features/connect/ConnectPage';
import AdminPreviewPage from '../features/admin/AdminPreviewPage';
import AdminSectionPage from '../features/admin/AdminSectionPage';
import ComponentShowcasePage from '../features/dev/ComponentShowcasePage';
import LegalPage from '../features/legal/LegalPage';
import NotFoundPage from '../components/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/assistant', element: <AssistantPage /> },
      { path: '/prayer', element: <PrayerPage /> },
      { path: '/journal', element: <JournalPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      { path: '/connect', element: <ConnectPage /> },
      { path: '/admin-preview', element: <AdminPreviewPage /> },
      { path: '/admin-preview/:section', element: <AdminSectionPage /> },
      { path: '/dev/components', element: <ComponentShowcasePage /> },
      { path: '/legal', element: <LegalPage /> },
      { path: '/legal/:doc', element: <LegalPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
