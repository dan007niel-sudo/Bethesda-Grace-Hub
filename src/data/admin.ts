export type AdminSection = {
  id: 'events' | 'sermons' | 'announcements' | 'ministries' | 'prayer-requests';
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
};

const sections: AdminSection[] = [
  {
    id: 'events',
    title: 'Manage Events',
    description: 'Read-only preview of the upcoming events list.',
    columns: ['Title', 'Date', 'Location', 'Status'],
    rows: [
      ['Sunday Service', '2026-05-17', 'Main Sanctuary', 'Published'],
      ['Evening of Prayer', '2026-05-21', 'Chapel', 'Published'],
      ['Newcomers Lunch', '2026-05-24', 'Fellowship Hall', 'Published'],
      ['Baptism Service', '2026-06-07', 'Main Sanctuary', 'Draft'],
      ['Youth Retreat Planning', '2026-06-14', 'Off-site', 'Draft'],
      ['Members Meeting', '2026-06-21', 'Main Sanctuary', 'Scheduled'],
    ],
  },
  {
    id: 'sermons',
    title: 'Manage Sermons',
    description: 'Read-only preview of the sermon archive.',
    columns: ['Title', 'Speaker', 'Date', 'Status'],
    rows: [
      ['The Grace That Finds Us', 'Pastor Daniel Mensah', '2026-05-03', 'Published'],
      ['A Quiet Faith in a Loud World', 'Pastor Naomi Becker', '2026-04-26', 'Published'],
      ['House of Grace', 'Pastor Daniel Mensah', '2026-04-19', 'Published'],
      ['Serving as Worship', 'Elder Ruth Anand', '2026-04-12', 'Published'],
      ['When the Word Becomes Flesh', 'Pastor Daniel Mensah', '2026-04-05', 'Published'],
      ['Honest Prayer', 'Pastor Naomi Becker', '2026-03-29', 'Published'],
      ['A Generation Looking for Truth', 'Pastor Samuel Okafor', '2026-03-22', 'Published'],
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
      ['Youth', 'Pastor Samuel Okafor', '6', 'Active'],
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
