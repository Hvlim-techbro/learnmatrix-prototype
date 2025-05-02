import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { User, Badge as BadgeType } from '@shared/schema';
import { motion } from 'framer-motion';
import { Book, Trophy, Flame, Clock, Plus } from 'lucide-react';
import AchievementBadge from '@/components/AchievementBadge';
import { getTierColor } from '@/lib/gamification';

export default function Profile() {
  const [, setLocation] = useLocation();
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: badges = [] } = useQuery<BadgeType[]>({
    queryKey: ['/api/user/badges'],
  });
  
  // Add default badges if none are returned
  const displayBadges = badges.length > 0 ? badges : [
    { id: 1, name: 'Quiz Champion', description: '10+ quiz battle wins', icon: 'trophy', color: 'accent-purple', userId: 1 },
    { id: 2, name: 'Streak Keeper', description: '7-day learning streak', icon: 'fire', color: 'accent-yellow', userId: 1 },
    { id: 3, name: 'Helper Bee', description: 'Answered 5+ cohort questions helpfully', icon: 'hands-helping', color: 'accent-green', userId: 1 },
    { id: 4, name: 'BEYOND Seeker', description: 'Used BEYOND to enrich 3+ lessons', icon: 'rocket', color: 'accent-blue', userId: 1 },
  ];
  
  const tierColor = getTierColor(user?.tier || 'Scholar Circle');
  
  // Learning stats
  const learningStats = [
    { icon: Book, value: '27', label: 'Lessons Completed', color: 'primary' },
    { icon: Trophy, value: '15', label: 'Quiz Battles Won', color: 'secondary' },
    { icon: Flame, value: user?.streak?.toString() || '5', label: 'Day Streak', color: 'accent-yellow' },
    { icon: Clock, value: '48h', label: 'Total Learning Time', color: 'accent-blue' },
  ];
  
  const handleVisitShop = () => {
    setLocation('/rewards');
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
        <p className="text-neutral-darker">Track your learning journey</p>
      </div>
      
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-neutral mb-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-xl mx-auto mb-3">
          {user?.avatarInitials || 'JS'}
        </div>
        <h3 className="text-xl font-bold">{user?.displayName || 'Jordan Smith'}</h3>
        <div className="flex justify-center items-center mt-1 mb-3">
          <div className={`bg-${tierColor} text-white rounded-full px-3 py-1 text-xs font-medium`}>
            {user?.tier || 'Scholar Circle'}
          </div>
        </div>
        <p className="text-sm text-neutral-darker">AI & Machine Learning Track</p>
      </motion.div>
      
      {/* Learning Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="font-semibold mb-4">Learning Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {learningStats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-neutral text-center"
            >
              <div className={`text-${stat.color} text-xl mb-1`}>
                <stat.icon className="h-5 w-5 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-neutral-darker">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Achievements</h3>
          <a href="#" className="text-sm text-primary">See All</a>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral">
          <div className="flex flex-wrap gap-4">
            {displayBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <AchievementBadge badge={badge} />
              </motion.div>
            ))}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-light text-neutral-darker flex items-center justify-center text-lg mb-1">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-xs text-center">More</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Reward Shop */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="font-semibold mb-4">Reward Shop</h3>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-medium">Available Points</div>
              <div className="text-2xl font-bold text-primary">{user?.xp || 1250} XP</div>
            </div>
            <button 
              className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium"
              onClick={handleVisitShop}
            >
              Visit Shop
            </button>
          </div>
          
          <div className="text-sm text-neutral-darker">
            Use your points to unlock custom avatars, new AI tutor voices, and exclusive content!
          </div>
        </div>
      </motion.div>
    </div>
  );
}
