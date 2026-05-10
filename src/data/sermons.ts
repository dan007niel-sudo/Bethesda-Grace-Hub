export type Sermon = {
  id: string;
  title: string;
  speaker: string;
  date: string; // ISO date
  scripture: string;
  summary: string;
  notes: string;
};

const sermons: Sermon[] = [
  {
    id: 'grace-that-finds-us',
    title: 'The Grace That Finds Us',
    speaker: 'Pastor Daniel Mensah',
    date: '2026-05-03',
    scripture: 'Romans 3:23–24',
    summary:
      'A look at the heart of the gospel: every one of us falls short, and grace meets us exactly there.',
    notes:
      'Three movements: the honest mirror of sin, the freely given gift of grace, the invitation to trust. Grace is not a reward we earn — it is a redemption we receive.',
  },
  {
    id: 'a-quiet-faith',
    title: 'A Quiet Faith in a Loud World',
    speaker: 'Pastor Naomi Becker',
    date: '2026-04-26',
    scripture: 'Psalm 46:10',
    summary:
      'Why stillness is not silence and why our anxious culture needs a steady, quiet kind of faith.',
    notes:
      'Stillness is an act of trust. We practice quiet because our God is the One who fights for us. Spiritual rest as resistance.',
  },
  {
    id: 'house-of-grace',
    title: 'House of Grace',
    speaker: 'Pastor Daniel Mensah',
    date: '2026-04-19',
    scripture: 'Ephesians 2:19–22',
    summary:
      'What it means to be built together as a household — not a building, but a people of grace.',
    notes:
      'A church is not a place we attend, it is a family we belong to. Belonging precedes performing. We are being built together, slowly, beautifully.',
  },
  {
    id: 'serve-as-worship',
    title: 'Serving as Worship',
    speaker: 'Elder Ruth Anand',
    date: '2026-04-12',
    scripture: 'Romans 12:1',
    summary:
      'Serving in the church and in the world is not the bonus round of the Christian life — it is the worship.',
    notes:
      'Five practical paths into ministry: hospitality, prayer, teaching, presence, generosity. Find the place where your gift meets a real need.',
  },
  {
    id: 'word-becomes-flesh',
    title: 'When the Word Becomes Flesh',
    speaker: 'Pastor Daniel Mensah',
    date: '2026-04-05',
    scripture: 'John 1:14',
    summary:
      'The scandal of the incarnation: the holy God of the universe enters our ordinary streets.',
    notes:
      'Incarnation reframes everything: bodies, neighborhoods, daily work. Following Jesus means following him into the ordinary.',
  },
  {
    id: 'prayer-that-honest',
    title: 'Honest Prayer',
    speaker: 'Pastor Naomi Becker',
    date: '2026-03-29',
    scripture: 'Psalm 13',
    summary: 'Why the Psalms give us permission to pray uncomfortable, honest prayers.',
    notes:
      'Lament is part of mature faith. God is not threatened by our questions. Move from honesty to hope, but never skip the honesty.',
  },
  {
    id: 'youth-and-truth',
    title: 'A Generation Looking for Truth',
    speaker: 'Pastor Samuel Okafor',
    date: '2026-03-22',
    scripture: '1 Timothy 4:12',
    summary:
      'A pastoral word to young adults navigating identity, calling, and a world of competing voices.',
    notes:
      'You are not too young to lead. Truth is not a position to defend — it is a person to follow. Spiritual maturity grows in community.',
  },
];

export async function getSermons(): Promise<Sermon[]> {
  return sermons;
}

export async function getSermonById(id: string): Promise<Sermon | undefined> {
  return sermons.find((s) => s.id === id);
}
