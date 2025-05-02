import { useState } from 'react';
import { Check, Trophy } from 'lucide-react';
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
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className={`text-${challenge.type === 'daily' ? 'accent-purple' : 'accent-green'} mr-3`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium">{challenge.title}</h4>
            <div className="text-xs text-neutral-darker mt-1">+{challenge.xpReward} XP</div>
          </div>
        </div>
        <button 
          className={`${
            isCompleted 
              ? 'bg-accent-green text-white' 
              : challenge.progress > 0 
                ? 'bg-neutral text-neutral-darker' 
                : 'bg-primary-light text-white'
          } rounded-full px-4 py-1 text-sm flex items-center`}
          onClick={handleStartChallenge}
          disabled={isCompleted || isUpdating}
        >
          {isCompleted && <Check className="h-4 w-4 mr-1" />}
          {progressText}
        </button>
      </div>
    </div>
  );
}
