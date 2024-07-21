// Options.js

export const SelectGoalList = [
  {
    id: 1,
    title: 'Build Muscle',
    desc: 'Gain muscle with training.',
    icon: ''
  },
  {
    id: 2,
    title: 'Lose Weight',
    desc: 'Burn calories and lose.',
    icon: '🔥'
  },
  {
    id: 3,
    title: 'Increase Strength',
    desc: 'Improve strength with lifting.',
    icon: '🏋️‍♂️'
  },
  {
    id: 4,
    title: 'Improve Endurance',
    desc: 'Boost stamina with cardio.',
    icon: '⌛'
  }
];

export const SelectBodyList = [
  {
    id: 1,
    title: 'Chest',
    desc: 'Unleash powerful upper strength',
    image: require('./../assets/images/chest.png')
  },
  {
    id: 2,
    title: 'Back',
    desc: 'Achieve a stronger back',
    image: require('./../assets/images/back.png')
  },
  {
    id: 3,
    title: 'Legs',
    desc: 'Build unstoppable leg power',
    image: require('./../assets/images/leg.png')
  },
  {
    id: 4,
    title: 'Shoulders',
    desc: 'Elevate your shoulder strength',
    image: require('./../assets/images/shoulder.png')
  },
  {
    id: 5,
    title: 'Arms',
    desc: 'Transform your arm power',
    image: require('./../assets/images/arm.png')
  },
  {
    id: 6,
    title: 'Core',
    desc: 'Master your core stability',
    image: require('./../assets/images/core.png')
  },
  {
    id: 7,
    title: 'Full Body',
    desc: 'Achieve total body fitness',
    image: require('./../assets/images/fullbody.png')
  }
];

export const SelectLevelList = [
  {
    id: 1,
    title: 'Beginner',
    desc: 'Starting out? This is for you',
    icon: '🌟'
  },
  {
    id: 2,
    title: 'Intermediate',
    desc: 'Ready for more? Step up!',
    icon: '🚀'
  },
  {
    id: 3,
    title: 'Advanced',
    desc: 'Challenge yourself with advanced workouts',
    icon: '🔥'
  },
  {
    id: 4,
    title: 'Expert',
    desc: 'For those who push their limits',
    icon: '🏆'
  }
];

export const AI_PROMPT = 'Generate a workout plan for location: {location}, for {goal} goal and for the body part, {bodyPart} and for training level {level}, with gym name, gym address, price, gym image url, geo coordinates in JSON format';
