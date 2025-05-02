import { Flame, Award, Star, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User, Badge } from '@shared/schema';

export default function ProgressCard() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const { data: badges = [] } = useQuery<Badge[]>({
    queryKey: ['/api/user/badges'],
  });

  // Calculate XP needed for next level
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpPerLevel = 300;
  const nextLevelXp = currentLevel * xpPerLevel;
  const progress = Math.min(100, (currentXp % xpPerLevel) / xpPerLevel * 100);
  
  return (
    <div className="mt-6 glass rounded-3xl-custom p-5 shadow-custom-md relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute w-40 h-40 rounded-full -top-20 -right-20 bg-gradient-primary opacity-10 blur-xl"></div>
      <div className="absolute w-32 h-32 rounded-full -bottom-16 -left-16 bg-gradient-secondary opacity-10 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-custom-sm">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold ml-3 text-lg">Your Progress</h3>
          </div>
          <div className="flex items-center bg-gradient-primary text-white px-3 py-1 rounded-full shadow-custom-sm">
            <Star className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Level {currentLevel}</span>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-accent-yellow mr-1" />
              <span className="text-sm font-medium">{currentXp % xpPerLevel}/{xpPerLevel} XP</span>
            </div>
            <span className="text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-primary" />
              Next: Level {currentLevel + 1}
            </span>
          </div>
          <div className="h-3 bg-neutral-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Streak Info */}
          <div className="glass rounded-xl p-3 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-yellow flex items-center justify-center shadow-custom-sm mr-3">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">{user?.streak || 0} Day Streak</div>
              <div className="text-xs text-neutral-darker">{user?.streak ? "Keep it going!" : "Start today!"}</div>
            </div>
          </div>
          
          {/* Badges Info */}
          <div className="glass rounded-xl p-3 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shadow-custom-sm mr-3">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">{badges.length} Badges</div>
              <div className="text-xs text-neutral-darker">{badges.length ? "Keep collecting!" : "Earn your first!"}</div>
            </div>
          </div>
        </div>
        
        {/* Tier Status */}
        <div className="glass rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:shadow-custom-sm transition-all duration-300">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-green flex items-center justify-center shadow-custom-sm mr-3">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">{user?.tier || "Novice Nexus"}</div>
              <div className="text-xs text-neutral-darker">Cohort Tier</div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="h-4 w-4 text-neutral-darker" />
          </div>
        </div>
      </div>
    </div>
  );
}
