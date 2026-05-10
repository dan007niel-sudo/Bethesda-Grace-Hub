export type Ministry = {
  id: string;
  name: string;
  shortDescription: string;
  callToAction: string;
  longDescription: string;
  timeCommitment: string;
  contactPlaceholder: string;
};

const ministries: Ministry[] = [
  {
    id: 'worship',
    name: 'Worship',
    shortDescription: 'Lead the church in song, prayer, and Sunday liturgy.',
    callToAction: 'Sing and play with us',
    longDescription:
      'The Worship Ministry serves the Sunday gathering through music, song selection, and pastoral care for the band and vocal team. We rehearse weekly and welcome musicians of all backgrounds.',
    timeCommitment: 'Weekly rehearsal (1.5 hours) plus Sunday morning.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'media',
    name: 'Media',
    shortDescription: 'Run audio, video, lighting, and live stream each Sunday.',
    callToAction: 'Serve behind the desk',
    longDescription:
      'The Media Team makes Sunday possible — sound engineering, projection, recording, and live streaming. Training is provided. A great fit for technically curious people.',
    timeCommitment: 'One Sunday in three, plus an occasional event.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'youth',
    name: 'Youth',
    shortDescription: 'Walk with teenagers in faith, friendship, and life questions.',
    callToAction: 'Mentor a young person',
    longDescription:
      'The Youth Ministry meets every Friday evening for teaching, small groups, and games. Leaders mentor teens through honest conversation and steady presence.',
    timeCommitment: 'Friday evenings (2 hours), plus occasional retreats.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'prayer',
    name: 'Prayer',
    shortDescription: 'Pray for the church, the city, and people who ask.',
    callToAction: 'Join the prayer team',
    longDescription:
      'The Prayer Team intercedes for the church family and follows up on prayer requests. We meet biweekly and pray together before each Sunday service.',
    timeCommitment: '30 minutes Sunday morning, plus a biweekly evening.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    shortDescription: 'Welcome newcomers, serve coffee, and create a warm Sunday.',
    callToAction: 'Welcome someone new',
    longDescription:
      'Hospitality is the first ministry a newcomer experiences. Greeters, coffee hosts, and welcome-desk volunteers help make Bethesda feel like home from the door.',
    timeCommitment: 'One Sunday in four, 30 minutes before and after.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'children',
    name: 'Children',
    shortDescription: 'Teach, love, and care for our youngest church family members.',
    callToAction: 'Serve a child',
    longDescription:
      'Our Children\'s Ministry runs Sunday programming for ages 0–11 with age-appropriate teaching, storytelling, and play. Background-check and safety training provided.',
    timeCommitment: 'One Sunday in three, plus occasional special events.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'evangelism',
    name: 'Evangelism',
    shortDescription: 'Share the good news of grace with our neighborhood.',
    callToAction: 'Share grace with the city',
    longDescription:
      'The Evangelism Team plans outreach events, equips members for everyday faith conversations, and partners with local organizations to serve the city in tangible ways.',
    timeCommitment: 'Monthly meeting plus quarterly outreach events.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
  {
    id: 'technical-team',
    name: 'Technical Team',
    shortDescription: 'Build and maintain the digital tools the church relies on.',
    callToAction: 'Build with us',
    longDescription:
      'The Technical Team supports websites, the app, internal tools, and AV infrastructure. A great place for software-minded members to use their craft for the church.',
    timeCommitment: 'Flexible — async work plus a monthly sync.',
    contactPlaceholder: 'A team contact will be available once the directory is connected.',
  },
];

export async function getMinistries(): Promise<Ministry[]> {
  return ministries;
}

export async function getMinistryById(id: string): Promise<Ministry | undefined> {
  return ministries.find((m) => m.id === id);
}
