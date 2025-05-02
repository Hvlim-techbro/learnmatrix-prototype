import { useState } from 'react';
import { Check, Trophy, Clock, Zap, Award } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Challenge } from '@shared/schema';
import { IconMap } from '@/lib/gamification';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ChallengeCardProps = {
  challenge: Challenge;
};

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const Icon = IconMap[challenge.type === 'daily' ? 'tasks' : 'highlighter'] || Award;
  
  const updateProgressMutation = useMutation({
    mutationFn: async (progress: number) => {
      return apiRequest('POST', `/api/challenges/${challenge.id}/progress`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenges/daily'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setIsUpdating(false);
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
  
  // Get the gradient and glow for the challenge type
  const getChallengeStyle = () => {
    switch (challenge.type) {
      case 'daily':
        return { gradient: 'bg-gradient-purple', glow: 'glow-secondary' };
      case 'weekly':
        return { gradient: 'bg-gradient-blue', glow: 'glow-primary' };
      case 'cohort':
        return { gradient: 'bg-gradient-green', glow: 'glow-green' };
      case 'seasonal':
        return { gradient: 'bg-gradient-yellow', glow: 'glow-yellow' };
      default:
        return { gradient: 'bg-gradient-primary', glow: 'glow-primary' };
    }
  };
  
  const { gradient, glow } = getChallengeStyle();
  
  const progressPercentage = (challenge.progress / challenge.target) * 100;
  
  return (
    <motion.div 
      className="bg-[#111] border border-[#222] rounded-xl p-4 shadow-md relative overflow-hidden group"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Progress indicator with animation */}
      <motion.div 
        className={cn(
          "absolute bottom-0 left-0 h-1",
          isCompleted ? 'bg-gradient-green' : gradient
        )}
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      ></motion.div>
      
      {/* Background subtle accent */}
      <div className={cn(
        "absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-5 blur-xl",
        gradient
      )}></div>
      
      {/* Subtle glow on completion */}
      {isCompleted && (
        <div className={cn(
          "absolute inset-0 opacity-10 rounded-xl",
          "glow-green"  
        )}></div>
      )}
      
      <div className="flex items-start justify-between relative z-0">
        <div className="flex">
          <motion.div 
            className={cn(
              "w-10 h-10 rounded-lg shadow-md flex items-center justify-center mr-3 flex-shrink-0",
              gradient
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
          
          <div>
            <h4 className="font-semibold text-white">{challenge.title}</h4>
            <p className="text-xs text-[#888] mt-1">{challenge.description}</p>
            
            <div className="flex mt-2 space-x-4">
              <div className="flex items-center text-xs text-[#888]">
                <Zap className="h-3 w-3 mr-1 text-[hsl(var(--accent-yellow))]" />
                <span>+{challenge.xpReward} XP</span>
              </div>
              
              {challenge.badgeReward && (
                <div className="flex items-center text-xs text-[#888]">
                  <Trophy className="h-3 w-3 mr-1 text-[hsl(var(--accent-yellow))]" />
                  <span>Badge</span>
                </div>
              )}
              
              {challenge.expiresAt && (
                <div className="flex items-center text-xs text-[#888]">
                  <Clock className="h-3 w-3 mr-1 text-[#888]" />
                  <span>{getTimeRemaining()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <motion.button 
          className={cn(
            "flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium flex items-center shadow-md transition-all",
            isCompleted 
              ? 'bg-gradient-green text-white' 
              : challenge.progress > 0 
                ? 'bg-[#222] text-[#888] hover:bg-[#333]' 
                : `${gradient} text-white`
          )}
          onClick={handleStartChallenge}
          disabled={isCompleted || isUpdating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCompleted && <Check className="h-4 w-4 mr-1" />}
          {isUpdating ? 'Updating...' : progressText}
        </motion.button>
      </div>
    </motion.div>
  );
}
