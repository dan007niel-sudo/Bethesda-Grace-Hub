export type AssistantPrompt = {
  id: string;
  prompt: string;
  response: string;
};

const prompts: AssistantPrompt[] = [
  {
    id: 'what-is-bgh',
    prompt: 'What is Bethesda Grace Hub?',
    response:
      'Bethesda Grace Hub is the digital home of Bethesda Evangelical Church — House of Grace. It is a place to find sermons, ministries, prayer support, and clear next steps in your faith journey. The Hub is built to help you connect through grace, grow in faith, and discover where you can serve.',
  },
  {
    id: 'join-ministry',
    prompt: 'How can I join a ministry?',
    response:
      'A great first step is to look through the Ministries page and read about teams that resonate with you — Worship, Youth, Hospitality, Children, Prayer, Media, Evangelism, or our Technical Team. Each ministry has a short description and a clear way to get involved. When the church directory is connected, you will be able to message the team lead directly. Until then, mention your interest at the welcome desk on a Sunday.',
  },
  {
    id: 'romans-3-23',
    prompt: 'Can you explain Romans 3:23–24?',
    response:
      'These two verses sit at the heart of the gospel. The first half is honest: every person has fallen short of God\'s glory — none of us measures up on our own. The second half is the good news: we are made right with God freely, by his grace, through the redemption that comes in Jesus. Grace is not earned by our effort; it is given as a gift, and the gift is anchored in Christ. The two verses belong together — the honesty of our condition is what makes the freeness of grace so beautiful.',
  },
  {
    id: 'prayer-request',
    prompt: 'How can I request prayer?',
    response:
      'You can share a prayer request through the Prayer page. The form lets you choose whether your request stays private between you and the pastoral team, or is shared with the wider prayer team. In this preview version, the form opens your email app with the request pre-filled — that way nothing is lost while we build the secure in-app submission system.',
  },
];

export async function getAssistantPrompts(): Promise<AssistantPrompt[]> {
  return prompts;
}
