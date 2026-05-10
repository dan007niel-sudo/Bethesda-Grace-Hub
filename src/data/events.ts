export type ChurchEvent = {
  id: string;
  title: string;
  date: string; // ISO datetime
  location: string;
  summary: string;
};

const events: ChurchEvent[] = [
  {
    id: 'sunday-service-may-17',
    title: 'Sunday Service',
    date: '2026-05-17T10:30:00',
    location: 'Main Sanctuary',
    summary: 'Worship, teaching, and communion. Childcare available for ages 0–6.',
  },
  {
    id: 'prayer-night-may-21',
    title: 'Evening of Prayer',
    date: '2026-05-21T19:00:00',
    location: 'Chapel',
    summary: 'A quiet hour of guided prayer, scripture, and song. Open to everyone.',
  },
  {
    id: 'newcomers-lunch-may-24',
    title: 'Newcomers Lunch',
    date: '2026-05-24T12:30:00',
    location: 'Fellowship Hall',
    summary: 'Meet the pastors and learn about life at Bethesda. Lunch on us.',
  },
  {
    id: 'baptism-service-jun-07',
    title: 'Baptism Service',
    date: '2026-06-07T10:30:00',
    location: 'Main Sanctuary',
    summary: 'Celebrating new believers taking their first public step of faith.',
  },
];

export async function getEvents(): Promise<ChurchEvent[]> {
  return events;
}
