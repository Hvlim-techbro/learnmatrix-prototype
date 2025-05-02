import { useState } from 'react';
import { Check, Trophy, Calendar, Target, Clock, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Challenge } from '@shared/schema';
import { IconMap } from '@/lib/gamification';

type ChallengeCardProps = {
  challenge: Challenge;
};

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const Icon = IconMap[challenge.type === 'daily' ? 'tasks' : 'highlighter'];
  
  const updateProgressMutation = useMutation({
    mutationFn: async (progress: number) => {
      return apiRequest('POST', `/api/challenges/${challenge.id}/progress`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/daily'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });
  
  const handleStartChallenge = () => {
    setIsUpdating(true);
    updateProgressMutation.mutate(challenge.progress + 1);
  };
  
  const isCompleted = challenge.progress >= challenge.target;
  const progressText = isCompleted 
    ? 'Completed!' 
    : `${challenge.progress}/${challenge.target} Done`;
    
  // Helper to format time remaining
  const getTimeRemaining = () => {
    if (!challenge.expiresAt) return "No deadline";
    
    const now = new Date();
    const expiresAt = new Date(challenge.expiresAt);
    const hoursRemaining = Math.max(0, Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    if (hoursRemaining < 1) return "Less than 1 hour";
    if (hoursRemaining < 24) return `${hoursRemaining} hours`;
    return `${Math.round(hoursRemaining / 24)} days`;
  };
  
  // Get the gradient for the challenge type
  const getChallengeGradient = () => {
    switch (challenge.type) {
      case 'daily':
        return 'bg-gradient-purple';
      case 'weekly':
        return 'bg-gradient-blue';
      case 'cohort':
        return 'bg-gradient-green';
      case 'seasonal':
        return 'bg-gradient-yellow';
      default:
        return 'bg-gradient-primary';
    }
  };
  
  const gradient = getChallengeGradient();
  
  return (
    <div className="glass rounded-2xl-custom p-4 shadow-custom-md transition-all duration-300 hover:shadow-custom-lg relative overflow-hidden">
      {/* Progress indicator */}
      <div 
        className={`absolute bottom-0 left-0 h-1 ${isCompleted ? 'bg-gradient-green' : gradient} transition-all duration-500 ease-out z-10`}
        style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
      ></div>
      
      {/* Background decoration */}
      <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full opacity-10 blur-xl ${gradient}`}></div>
      
      <div className="flex items-start justify-between relative z-0">
        <div className="flex">
          <div className={`${gradient} w-10 h-10 rounded-lg shadow-custom-sm flex items-center justify-center mr-3 flex-shrink-0`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          
          <div>
            <h4 className="font-semibold">{challenge.title}</h4>
            <p className="text-xs text-neutral-darker mt-1">{challenge.description}</p>
            
            <div className="flex mt-2 space-x-3">
              <div className="flex items-center text-xs text-neutral-darker">
                <Zap className="h-3 w-3 mr-1 text-accent-yellow" />
                <span>+{challenge.xpReward} XP</span>
              </div>
              
              {challenge.badgeReward && (
                <div className="flex items-center text-xs text-neutral-darker">
                  <Trophy className="h-3 w-3 mr-1 text-accent-yellow" />
                  <span>Badge</span>
                </div>
              )}
              
              {challenge.expiresAt && (
                <div className="flex items-center text-xs text-neutral-darker">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{getTimeRemaining()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button 
          className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center shadow-custom-sm transition-all duration-300 ${
            isCompleted 
              ? 'bg-gradient-green text-white' 
              : challenge.progress > 0 
                ? 'glass text-neutral-darker' 
                : 'bg-gradient-primary text-white hover:shadow-custom-md'
          }`}
          onClick={handleStartChallenge}
          disabled={isCompleted || isUpdating}
        >
          {isCompleted && <Check className="h-4 w-4 mr-1" />}
          {isUpdating ? 'Updating...' : progressText}
        </button>
      </div>
    </div>
  );
}
