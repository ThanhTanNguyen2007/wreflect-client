export type templateHealthCheckType = {
  id: string;
  title: string;
  statements: {
    id: string;
    title: string;
    color: string;
    description: string;
  }[];
};

export default [
  {
    id: '1',
    title: 'Team Health Check',
    statements: [
      {
        id: '1',
        title: 'Purpose',
        color: 'orange',
        description: 'We understand how our team contributes to the organisation, and our mission purpose is',
      },
      {
        id: '2',
        title: 'Owner',
        color: 'blue',
        description:
          "The team has clear ownership or a dedicated product owner who is accountable for the team's results.",
      },
      {
        id: '3',
        title: 'Decisions',
        color: 'purple',
        description:
          'Are we good at making decisions as a team? When stuck we de-scope the decision, or design them as experiments.',
      },
      {
        id: '4',
        title: 'Value',
        color: 'pink',
        description: 'We can define and measure the value we provide to the business and the end user.',
      },
      {
        id: '5',
        title: 'Teamwork',
        color: 'green',
        description: 'Do we often collaborate closely with each other toward common goals?',
      },
      {
        id: '6',
        title: 'Trust',
        color: 'lpink',
        description:
          "I feel safe to be myself and to share my thoughts. We don't hesitate to engage in constructive conflicts.",
      },
      {
        id: '7',
        title: 'Communication',
        color: 'lblue',
        description:
          'We communicate clearly and openly, we share our issues, reduce our conflicts and give constructive feedback.',
      },
      {
        id: '8',
        title: 'Team Autonomy',
        color: 'orange',
        description:
          'We communicate clearly and openly, we share our issues, reduce our conflicts and give constructive feedback.',
      },
      {
        id: '9',
        title: 'Goal Alignment',
        color: 'blue',
        description: 'Everyone understands why we are here, what we are trying to achieve and what is our end goal.',
      },
      {
        id: '10',
        title: 'Fun',
        color: 'purple',
        description: 'We never forget to have fun while working, we enjoy our work and look forward to coming to work.',
      },
    ],
  },
  {
    id: '2',
    title: 'Squad Health Check',
    statements: [
      {
        id: '1',
        title: 'Delivering Value',
        color: 'orange',
        description:
          "Good: We deliver great stuff. We're proud of it and our stakeholders are really happy. Bad: We deliver crap. We feel ashamed to deliver it. Our stakeholders hate us.",
      },
      {
        id: '2',
        title: 'Easy to Release',
        color: 'blue',
        description:
          'Good: Releasing is simple, safe, painless and mostly automated. Bad: Releasing is risky, painful, lots of manual work and takes forever.',
      },
      {
        id: '3',
        title: 'Fun',
        color: 'purple',
        description:
          'Good: We love going to work and have great fun working together. Bad: We love going to work and have great fun working together, Bad: Boring ...',
      },
      {
        id: '4',
        title: 'Health of Codebase',
        color: 'pink',
        description:
          "Good: We're proud of the quality of our code. It is clean, easy to read and has great test coverage. Bad: Our code is a pile of dung and technical debt is raging out of control.",
      },
      {
        id: '5',
        title: 'Learning',
        color: 'green',
        description:
          "Good: We're learning lots of interesting stuff all the time. Bad: We never have time to learn anything.",
      },
      {
        id: '6',
        title: 'Mission',
        color: 'lpink',
        description:
          'Good: We know exactly why we are here and we’re really excited about it. Bad: We have no idea why we are here. There’s no high lever picture or focus. Our so-called mission is completely unclear and uninspiring.',
      },
      {
        id: '7',
        title: 'Pawns or Players',
        color: 'lblue',
        description:
          'Good: We are in control of our own destiny. We decide what to build and how to build it. Bad: We are just pawns in a game of chess with no influence over what we build or how we build it.',
      },
      {
        id: '8',
        title: 'Speed',
        color: 'orange',
        description:
          'Good: We get stuff done really quickly. No waiting and no delays. Bad: We never seem to get anything done. We keep getting stuck or interrupted. Stories keep getting stuck on dependencies.',
      },
      {
        id: '9',
        title: 'Suitable Process',
        color: 'blue',
        description: 'Good: Our way of working fits us perfectly. Bad: Our way of working sucks.',
      },
      {
        id: '10',
        title: 'Support',
        color: 'purple',
        description:
          "Good: We always get great support and help when we ask for it. Bad: We keep getting stuck because we can't get the support and help that we ask for.",
      },
      {
        id: '11',
        title: 'Teamwork',
        color: 'pink',
        description:
          'Good: We are a totally gelled super-team with awesome collaboration. Bad: We are a bunch of individuals that neither know nor care about what the other people in the squad are doing.',
      },
    ],
  },
  {
    id: '3',
    title: 'Team Health Radar',
    statements: [
      {
        id: '1',
        title: 'Mission',
        color: 'orange',
        description:
          "We are all aligned with the company's goals. Therefore, we know what to do as a team to achieve our objectives and deliver value.",
      },
      {
        id: '2',
        title: 'Ownership',
        color: 'blue',
        description:
          'Our team works autonomously and can make decisions on its own. Our ownership is easily identifiable from inside and outside the team.',
      },
      {
        id: '3',
        title: 'Value',
        color: 'purple',
        description:
          'The value we create for both the business and our users is easily identifiable, measurable, and deliverable.',
      },
      {
        id: '4',
        title: 'Speed',
        color: 'pink',
        description:
          'We can deliver quality value while respecting delivery dates. The team is working at a healthy and maintainable pace.',
      },
      {
        id: '5',
        title: 'Process',
        color: 'green',
        description:
          'Our processes are rightfully designed and help us deliver value. We do not feel slowed down or blocked because of them.',
      },
      {
        id: '6',
        title: 'Roles',
        color: 'lpink',
        description:
          'The roles and responsibilities of each team member are clear to everyone. All the skills necessary for the success of the team are present.',
      },
      {
        id: '7',
        title: 'Collaboration',
        color: 'lblue',
        description: 'We collaborate in a meaningful and supportive way, we try to help each other as much as possible',
      },
      {
        id: '8',
        title: 'Fun',
        color: 'pink',
        description: 'We never forget to have fun while working, we enjoy our work and look forward to coming to work.',
      },
      {
        id: '9',
        title: 'Learning',
        color: 'blue',
        description: 'Team members keep developing their skills through repeated learnings.',
      },
      {
        id: '10',
        title: 'Resources',
        color: 'purple',
        description: 'We have access to all the material resources and support we need to accomplish our mission.',
      },
    ],
  },
];
