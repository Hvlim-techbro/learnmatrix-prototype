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
    <div className="p-6 bg-black min-h-[calc(100vh-8rem)]">
      {/* Profile background effect */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#1E1E1E] to-transparent opacity-50 -z-10"></div>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-white">Your Profile</h2>
        <p className="text-[#888]">Track your learning journey</p>
      </motion.div>
      
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1E1E1E] rounded-xl p-6 shadow-md border border-[#333] mb-6 text-center"
        whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      >
        <motion.div 
          className="w-24 h-24 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)' }}
          animate={{ 
            boxShadow: ['0 0 0 rgba(124, 58, 237, 0)', '0 0 20px rgba(124, 58, 237, 0.5)', '0 0 0 rgba(124, 58, 237, 0)'] 
          }}
          transition={{ 
            boxShadow: { repeat: Infinity, duration: 3 },
            scale: { type: 'spring', stiffness: 300, damping: 10 }
          }}
        >
          {user?.avatarInitials || 'JS'}
        </motion.div>
        <h3 className="text-xl font-bold text-white">{user?.displayName || 'Jordan Smith'}</h3>
        <div className="flex justify-center items-center mt-2 mb-4">
          <motion.div 
            className={`bg-gradient-${tierColor.toLowerCase()} text-white rounded-full px-4 py-1.5 text-xs font-medium shadow-md`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {user?.tier || 'Scholar Circle'}
          </motion.div>
        </div>
        <p className="text-sm text-[#888]">AI & Machine Learning Track</p>
      </motion.div>
      
      {/* Learning Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="font-semibold mb-4 text-white">Learning Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {learningStats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="bg-[#1E1E1E] rounded-xl p-5 shadow-md border border-[#333] text-center"
              whileHover={{ y: -5, borderColor: '#333', backgroundColor: '#161616' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className={`text-${stat.color === 'primary' ? 'primary' : 
                  stat.color === 'secondary' ? 'secondary' : 
                  stat.color === 'accent-blue' ? 'blue-400' : 
                  stat.color === 'accent-yellow' ? 'yellow-400' : 'primary'} text-xl mb-2`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <stat.icon className="h-6 w-6 mx-auto" />
              </motion.div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-[#888] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Achievements</h3>
          <motion.a 
            href="#" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            See All
          </motion.a>
        </div>
        <motion.div 
          className="bg-[#1E1E1E] rounded-xl p-6 shadow-md border border-[#333]"
          whileHover={{ borderColor: '#333' }}
        >
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
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
            <motion.div 
              className="flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-[#333] text-[#aaa] flex items-center justify-center text-lg mb-2 cursor-pointer hover:bg-[#444] hover:text-white transition-colors"
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Plus className="h-6 w-6" />
              </motion.div>
              <span className="text-xs text-[#888]">More</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Reward Shop */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Reward Shop</h3>
          <div className="flex items-center text-xs text-[#aaa] bg-[#333] rounded-lg px-3 py-1">
            <span className="font-medium text-transparent bg-clip-text bg-gradient-primary">{user?.xp || 1250} XP</span>
            <span className="ml-1">available</span>
          </div>
        </div>
        <motion.div 
          className="bg-[#1E1E1E] rounded-xl p-6 shadow-md border border-[#333] overflow-hidden relative hover:shadow-lg transition-all duration-300"
          whileHover={{ borderColor: '#29B6F6', scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Decorative background elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-secondary opacity-10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-primary opacity-10 rounded-full blur-xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 relative z-10">
            <div className="mb-4 md:mb-0">
              <div className="font-medium text-white mb-1">Available Points</div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-primary">
                {user?.xp || 1250} XP
              </div>
            </div>
            <motion.button 
              className="bg-[#29B6F6] hover:bg-[#29B6F6]/90 text-white rounded-lg px-5 py-3 text-sm font-medium shadow-lg"
              onClick={handleVisitShop}
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(41, 182, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Visit Reward Shop
            </motion.button>
          </div>
          
          <div className="text-sm text-[#888] relative z-10">
            Use your points to unlock custom avatars, new AI tutor voices, and exclusive content!
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
