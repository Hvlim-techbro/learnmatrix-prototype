import {
  Home,
  Mic,
  School, // Changed from ChalkboardUser which doesn't exist
  Trophy,
  Users,
  BookOpen,
  Rocket,
  Medal,
  Flame, // Changed from Fire which doesn't exist
  Lightbulb,
  Zap,
  CheckCircle,
  ListChecks,
  Highlighter,
  HelpingHand,
  Award, // Changed from Certificate which doesn't exist
  Book,
  MessageSquare,
  Info,
  Clock,
  Plus,
  Play,
  Music,
  Mic2, // Changed from MicrophoneStage which doesn't exist
  Undo,
  Forward,
  Star,
  User,
} from 'lucide-react';

// Map of icon names to Lucide React components
export const IconMap: { [key: string]: any } = {
  'home': Home,
  'microphone-alt': Mic2,
  'chalkboard-teacher': School,
  'trophy': Trophy,
  'users': Users,
  'book-open': BookOpen,
  'rocket': Rocket,
  'medal': Medal,
  'fire': Flame,
  'lightbulb': Lightbulb,
  'zap': Zap,
  'check-circle': CheckCircle,
  'tasks': ListChecks,
  'highlighter': Highlighter,
  'hands-helping': HelpingHand,
  'certificate': Award,
  'book': Book,
  'comment-alt': MessageSquare,
  'info-circle': Info,
  'clock': Clock,
  'plus': Plus,
  'play': Play,
  'music': Music,
  'undo': Undo,
  'forward': Forward,
  'star': Star,
  'user': User,
};

// XP calculation helpers
export const calculateLevelFromXp = (xp: number): number => {
  return Math.floor(xp / 300) + 1;
};

export const calculateXpForNextLevel = (level: number): number => {
  return level * 300;
};

// Tier system
export const tiers = [
  { name: 'Novice Nexus', description: 'New learners, just starting out' },
  { name: 'Scholar Circle', description: 'Regular activity, consistent study' },
  { name: 'Mentor Hive', description: 'Strong peer-to-peer support system' },
  { name: 'ThinkTank Tier', description: 'Advanced group with problem-solving sessions' },
  { name: 'Mastermind Guild', description: 'Elite learners, top performance, innovation' },
];

export const getTierIndex = (tier: string): number => {
  return tiers.findIndex(t => t.name === tier);
};

export const getTierColor = (tier: string): string => {
  const colors = ['primary', 'accent-green', 'accent-blue', 'accent-purple', 'accent-yellow'];
  const index = getTierIndex(tier);
  return colors[index] || colors[0];
};

// Badge definitions
export const badgeDefinitions = [
  { name: 'Streak Keeper', description: '7-day learning streak', icon: 'fire', color: 'accent-yellow' },
  { name: 'Quiz Champion', description: '10+ quiz battle wins', icon: 'trophy', color: 'accent-purple' },
  { name: 'Fast Learner', description: 'Top 5% of cohort in lesson completion speed', icon: 'zap', color: 'accent-blue' },
  { name: 'Helper Bee', description: 'Answered 5+ cohort questions helpfully', icon: 'hands-helping', color: 'accent-green' },
  { name: 'BEYOND Seeker', description: 'Used BEYOND to enrich 3+ lessons', icon: 'rocket', color: 'primary' },
];

// Challenge reward calculation
export const getXpRewardForChallenge = (type: string, difficulty: number = 1): number => {
  const baseRewards = {
    'daily': 10,
    'weekly': 25,
    'cohort': 50,
    'seasonal': 100,
  };
  
  return (baseRewards[type as keyof typeof baseRewards] || 10) * difficulty;
};

// Quiz Battle ranks
export const quizRanks = [
  { name: 'Bronze', minWins: 0 },
  { name: 'Silver', minWins: 5 },
  { name: 'Gold', minWins: 15 },
  { name: 'Platinum', minWins: 30 },
];

export const getQuizRank = (wins: number): string => {
  // Find the highest rank the user qualifies for
  for (let i = quizRanks.length - 1; i >= 0; i--) {
    if (wins >= quizRanks[i].minWins) {
      return quizRanks[i].name;
    }
  }
  return quizRanks[0].name;
};

export const getQuizRankColor = (rank: string): string => {
  const colors = {
    'Bronze': 'bg-amber-700',
    'Silver': 'bg-slate-400',
    'Gold': 'bg-accent-yellow',
    'Platinum': 'bg-slate-700',
  };
  
  return colors[rank as keyof typeof colors] || 'bg-accent-yellow';
};
