export type Announcement = {
  id: string;
  title: string;
  date: string; // ISO date
  body: string;
};

const announcements: Announcement[] = [
  {
    id: 'new-ministry-season',
    title: 'New ministry season starting in June',
    date: '2026-05-08',
    body: 'Sign-ups for the summer ministry season are open. Worship, Children, and Hospitality teams are all welcoming new members.',
  },
  {
    id: 'parking-update',
    title: 'Updated parking around the church',
    date: '2026-05-05',
    body: 'The west lot will be closed for resurfacing on May 18–19. Additional street parking and overflow lot signage will be in place.',
  },
  {
    id: 'pastoral-care-line',
    title: 'New pastoral care line',
    date: '2026-04-30',
    body: 'A direct phone line for pastoral support requests is now available weekdays from 9 to 5. Details in the upcoming Sunday bulletin.',
  },
];

export async function getAnnouncements(): Promise<Announcement[]> {
  return announcements;
}
