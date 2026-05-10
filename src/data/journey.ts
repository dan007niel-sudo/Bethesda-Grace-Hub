export type JourneyStep = {
  id: string;
  title: string;
  shortDescription: string;
  nextStepLabel: string;
  /** If set, the step's primary action deep-links to this internal route instead of the static step page. */
  deepLinkTo?: string;
  guidance: string;
};

const journey: JourneyStep[] = [
  {
    id: 'new-here',
    title: 'I am new here',
    shortDescription:
      'Welcome. Take a moment to find your bearings — there is no rush, and there is a place for you.',
    nextStepLabel: 'Start here',
    guidance:
      'A great first step is joining us on a Sunday. After the service, our welcome team can answer questions and introduce you to a pastor. We also host a Newcomers Lunch every few months — it is the easiest way to meet people without pressure.',
  },
  {
    id: 'know-jesus',
    title: 'I want to know Jesus',
    shortDescription:
      'Curiosity about faith is a gift. We would love to walk with you as you explore.',
    nextStepLabel: 'Learn more',
    guidance:
      'Knowing Jesus begins with honest questions. Reach out to a pastor for a one-on-one conversation, or join one of our seasonal Faith Foundations groups — a small, low-pressure space to read, ask, and reflect together.',
  },
  {
    id: 'baptism',
    title: 'I want to be baptized',
    shortDescription:
      'Baptism is a public step that tells the story of grace in your life.',
    nextStepLabel: 'Begin the conversation',
    guidance:
      'We hold baptism services twice a year. Before the service, you will meet with a pastor to share your story and walk through what baptism means. There is no pressure — only joy in the next step.',
  },
  {
    id: 'membership',
    title: 'I want to become a member',
    shortDescription:
      'Membership is a way of saying: this is my church family, and I am committed.',
    nextStepLabel: 'Explore membership',
    guidance:
      'The path to membership begins with a short class that introduces our beliefs, our story, and how we serve together. After that, you meet with an elder for a conversation and a prayer of welcome.',
  },
  {
    id: 'serve',
    title: 'I want to serve',
    shortDescription:
      'Serving is one of the most joyful ways to grow in faith and friendship.',
    nextStepLabel: 'Find your place',
    guidance:
      'Take a look at the Ministries page to see where teams are growing. If you are unsure, that is normal — a five-minute conversation with a ministry lead is the best way to find a fit.',
  },
  {
    id: 'need-prayer',
    title: 'I need prayer',
    shortDescription:
      'You are not alone. Our prayer team is honored to pray for you.',
    nextStepLabel: 'Send a prayer request',
    deepLinkTo: '/prayer',
    guidance:
      'Use the Prayer page to share what is on your heart. Your request goes only to the people you choose, and you can ask for it to be kept private between you and a pastor.',
  },
  {
    id: 'grow-spiritually',
    title: 'I want to grow spiritually',
    shortDescription:
      'Spiritual growth is slow, steady, and shared. We have rhythms and people to help.',
    nextStepLabel: 'See growth paths',
    guidance:
      'Three rhythms shape spiritual growth here: weekly worship, a small group, and a personal practice (prayer, scripture, sabbath). Reach out to a pastor for a recommended reading plan or group.',
  },
];

export async function getJourneySteps(): Promise<JourneyStep[]> {
  return journey;
}

export async function getJourneyStep(id: string): Promise<JourneyStep | undefined> {
  return journey.find((s) => s.id === id);
}
