import { getWeeklySchedule } from './events';

export type AdminSection = {
  id: 'events' | 'announcements' | 'prayer-requests';
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
};

const eventRows: string[][] = getWeeklySchedule().map((s) => [
  s.weekday,
  s.time,
  s.title,
  s.cadence,
  s.location,
  'Active',
]);

const sections: AdminSection[] = [
  {
    id: 'events',
    title: 'Manage Events',
    description: 'Read-only preview of the recurring schedule.',
    columns: ['Day', 'Time', 'Event', 'Cadence', 'Location', 'Status'],
    rows: eventRows,
  },
  {
    id: 'announcements',
    title: 'Manage Announcements',
    description: 'Read-only preview of recent announcements.',
    columns: ['Title', 'Date', 'Author', 'Status'],
    rows: [
      ['New ministry season starting in June', '2026-05-08', 'Pastor Daniel', 'Published'],
      ['Updated parking around the church', '2026-05-05', 'Office', 'Published'],
      ['New pastoral care line', '2026-04-30', 'Pastor Naomi', 'Published'],
      ['Summer schedule', '2026-04-22', 'Office', 'Draft'],
      ['Volunteer appreciation', '2026-04-15', 'Pastor Daniel', 'Archived'],
    ],
  },
  {
    id: 'prayer-requests',
    title: 'View Prayer Requests',
    description: 'Read-only preview of recent prayer requests.',
    columns: ['Submitted', 'Name', 'Visibility', 'Status'],
    rows: [
      ['2026-05-08', 'Mara K.', 'Private', 'Open'],
      ['2026-05-07', 'Anonymous', 'Shared', 'In follow-up'],
      ['2026-05-06', 'Tobias W.', 'Private', 'Closed'],
      ['2026-05-05', 'Linnea S.', 'Shared', 'Open'],
      ['2026-05-04', 'Anonymous', 'Private', 'Open'],
      ['2026-05-03', 'Christoph H.', 'Shared', 'In follow-up'],
    ],
  },
];

export async function getAdminSections(): Promise<AdminSection[]> {
  return sections;
}

export async function getAdminSection(
  id: AdminSection['id'] | string,
): Promise<AdminSection | undefined> {
  return sections.find((s) => s.id === id);
}
