import { Flame } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';

export default function ProgressCard() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  // Calculate XP needed for next level
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpPerLevel = 300;
  const nextLevelXp = currentLevel * xpPerLevel;
  const progress = Math.min(100, (currentXp % xpPerLevel) / xpPerLevel * 100);
  
  return (
    <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-neutral">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Your Progress</h3>
        <span className="text-sm text-neutral-darker">Level {currentLevel}</span>
      </div>
      
      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{currentXp % xpPerLevel}/{xpPerLevel} XP</span>
          <span className="text-sm text-primary-light">Next: Level {currentLevel + 1}</span>
        </div>
        <div className="h-3 bg-neutral-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Streak Info */}
      <div className="flex items-center mt-3">
        <div className="text-accent-yellow mr-2">
          <Flame className="h-5 w-5" />
        </div>
        <span className="text-sm">{user?.streak || 0} day streak! {user?.streak ? "Keep it going!" : "Start your streak today!"}</span>
      </div>
    </div>
  );
}
