import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import HomePage from '../features/home/HomePage';
import AssistantPage from '../features/assistant/AssistantPage';
import SermonsPage from '../features/sermons/SermonsPage';
import SermonDetailPage from '../features/sermons/SermonDetailPage';
import MinistriesPage from '../features/ministries/MinistriesPage';
import MinistryDetailPage from '../features/ministries/MinistryDetailPage';
import PrayerPage from '../features/prayer/PrayerPage';
import JourneyPage from '../features/journey/JourneyPage';
import JourneyStepPage from '../features/journey/JourneyStepPage';
import AdminPreviewPage from '../features/admin/AdminPreviewPage';
import AdminSectionPage from '../features/admin/AdminSectionPage';
import ComponentShowcasePage from '../features/dev/ComponentShowcasePage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/assistant', element: <AssistantPage /> },
      { path: '/sermons', element: <SermonsPage /> },
      { path: '/sermons/:id', element: <SermonDetailPage /> },
      { path: '/ministries', element: <MinistriesPage /> },
      { path: '/ministries/:id', element: <MinistryDetailPage /> },
      { path: '/prayer', element: <PrayerPage /> },
      { path: '/journey', element: <JourneyPage /> },
      { path: '/journey/:step', element: <JourneyStepPage /> },
      { path: '/admin-preview', element: <AdminPreviewPage /> },
      { path: '/admin-preview/:section', element: <AdminSectionPage /> },
      { path: '/dev/components', element: <ComponentShowcasePage /> },
    ],
  },
]);
