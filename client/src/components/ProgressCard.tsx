import { Flame, Award, Star, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User, Badge } from '@shared/schema';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  const xpForCurrentLevel = currentXp % xpPerLevel;
  
  // Performance optimized variants - reduced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05 // Reduced stagger time
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  return (
    <motion.div 
      className="mt-6 bg-[#111] border border-[#222] rounded-xl p-5 shadow-lg relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements - optimized with lower blur */}
      <div className="absolute w-64 h-64 rounded-full -top-20 -right-20 bg-gradient-primary opacity-5 blur-md"></div>
      <div className="absolute w-48 h-48 rounded-full -bottom-20 -left-20 bg-gradient-secondary opacity-5 blur-md"></div>
      
      <div className="relative z-10">
        <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold ml-3 text-lg text-white">Your Progress</h3>
          </div>
          <div className="flex items-center bg-gradient-primary text-white px-3 py-1 rounded-full shadow-md">
            <Star className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Level</span>
            <span className="text-sm font-bold ml-1">{currentLevel}</span>
          </div>
        </motion.div>
        
        {/* XP Progress Bar - Simplified motion */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-[hsl(var(--accent-yellow))] mr-1" />
              <span className="text-sm font-medium text-white">
                {xpForCurrentLevel}
                <span className="text-[#888] mx-1">/</span>
                {xpPerLevel} XP
              </span>
            </div>
            <span className="text-sm flex items-center text-[#888]">
              <TrendingUp className="h-3 w-3 mr-1 text-primary" />
              Next: Level {currentLevel + 1}
            </span>
          </div>
          <div className="h-3 bg-[#222] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-primary rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} // Reduced animation time
            ></motion.div>
          </div>
        </motion.div>
        
        {/* Stats Overview - Reduced hover animations */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Streak Info */}
          <motion.div 
            className="bg-[#161616] border border-[#222] rounded-lg p-3 flex items-center hover:border-[#333]"
            variants={itemVariants}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-yellow flex items-center justify-center shadow-md mr-3">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">
                {user?.streak || 0} Day Streak
              </div>
              <div className="text-xs text-[#888]">{user?.streak ? "Keep it going!" : "Start today!"}</div>
            </div>
          </motion.div>
          
          {/* Badges Info */}
          <motion.div 
            className="bg-[#161616] border border-[#222] rounded-lg p-3 flex items-center hover:border-[#333]"
            variants={itemVariants}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shadow-md mr-3">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">
                {badges.length} Badges
              </div>
              <div className="text-xs text-[#888]">{badges.length ? "Keep collecting!" : "Earn your first!"}</div>
            </div>
          </motion.div>
        </div>
        
        {/* Tier Status - Reduced animations */}
        <motion.div 
          className="bg-[#161616] border border-[#222] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-[#333] transition-colors"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-green flex items-center justify-center shadow-md mr-3">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">{user?.tier || "Novice Nexus"}</div>
              <div className="text-xs text-[#888]">Cohort Tier</div>
            </div>
          </div>
          <div className="text-primary">
            <ArrowRight className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
