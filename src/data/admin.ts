import { getWeeklySchedule } from './events';

export type AdminSection = {
  id: 'events' | 'sermons' | 'announcements' | 'ministries' | 'prayer-requests';
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
};

const eventRows: string[][] = getWeeklySchedule().map((s) => [
  s.weekday,
  s.time,
  s.title,
  s.location,
  'Active',
]);

const sections: AdminSection[] = [
  {
    id: 'events',
    title: 'Manage Events',
    description: 'Read-only preview of the recurring weekly schedule.',
    columns: ['Day', 'Time', 'Event', 'Location', 'Status'],
    rows: eventRows,
  },
  {
    id: 'sermons',
    title: 'Manage Sermons',
    description: 'Read-only preview of the sermon archive.',
    columns: ['Title', 'Speaker', 'Date', 'Status'],
    rows: [
      ['The Grace That Finds Us', 'Pastor Stephen Essah', '2026-05-03', 'Published'],
      ['A Quiet Faith in a Loud World', 'Pastor Stephen Essah', '2026-04-26', 'Published'],
      ['House of Grace', 'Pastor Stephen Essah', '2026-04-19', 'Published'],
      ['Serving as Worship', 'Pastor Stephen Essah', '2026-04-12', 'Published'],
      ['When the Word Becomes Flesh', 'Pastor Stephen Essah', '2026-04-05', 'Published'],
      ['Honest Prayer', 'Pastor Stephen Essah', '2026-03-29', 'Published'],
      ['A Generation Looking for Truth', 'Pastor Stephen Essah', '2026-03-22', 'Published'],
    ],
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
    id: 'ministries',
    title: 'Manage Ministries',
    description: 'Read-only preview of ministry teams.',
    columns: ['Ministry', 'Lead', 'Members', 'Status'],
    rows: [
      ['Worship', 'Lena Ashford', '14', 'Active'],
      ['Media', 'Tomás Ribeiro', '9', 'Active'],
      ['Youth', '—', '6', 'Active'],
      ['Prayer', 'Esther Adebayo', '11', 'Active'],
      ['Hospitality', 'Mark Stenson', '18', 'Active'],
      ['Children', 'Aisha Karim', '12', 'Active'],
      ['Evangelism', 'Joel Vasquez', '7', 'Active'],
      ['Technical Team', 'Daniel Lordson', '5', 'Active'],
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
