import { Badge } from '@shared/schema';
import { Award, Zap, Trophy, Flame, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type AchievementBadgeProps = {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
};

export default function AchievementBadge({ badge, size = 'md' }: AchievementBadgeProps) {
  // Get the appropriate Lucide icon component based on the icon name
  const getIcon = () => {
    switch(badge.icon) {
      case 'fire': return <Flame />;
      case 'zap': return <Zap />;
      case 'trophy': return <Trophy />;
      case 'medal': return <Medal />;
      case 'star': return <Star />;
      default: return <Award />;
    }
  };
  
  // Map badge color string to gradient class and glow
  const getBadgeStyle = () => {
    switch(badge.color) {
      case 'primary': return { gradient: 'bg-gradient-primary', glow: 'glow-primary' };
      case 'secondary': return { gradient: 'bg-gradient-secondary', glow: 'glow-secondary' };
      case 'accent-blue': return { gradient: 'bg-gradient-blue', glow: 'glow-primary' };
      case 'accent-purple': return { gradient: 'bg-gradient-purple', glow: 'glow-secondary' };
      case 'accent-green': return { gradient: 'bg-gradient-green', glow: 'glow-green' };
      case 'accent-yellow': return { gradient: 'bg-gradient-yellow', glow: 'glow-yellow' };
      default: return { gradient: 'bg-gradient-primary', glow: 'glow-primary' };
    }
  };
  
  // Size classes
  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return { container: 'w-16 h-16', icon: 'h-6 w-6' };
      case 'md': return { container: 'w-20 h-20', icon: 'h-8 w-8' };
      case 'lg': return { container: 'w-24 h-24', icon: 'h-10 w-10' };
      default: return { container: 'w-20 h-20', icon: 'h-8 w-8' };
    }
  };
  
  const sizeClasses = getSizeClasses();
  const badgeStyle = getBadgeStyle();
  
  return (
    <motion.div 
      className="flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <motion.div 
        className={cn(
          sizeClasses.container,
          'rounded-full flex items-center justify-center shadow-lg mb-2 relative overflow-hidden',
          badgeStyle.gradient
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
      >
        {/* Background pattern for more visual interest */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white"></div>
          <div className="absolute top-1/2 right-3 w-6 h-6 rounded-full bg-white"></div>
          <div className="absolute bottom-2 left-1/2 w-4 h-4 rounded-full bg-white"></div>
        </div>
        
        {/* Icon with animation */}
        <motion.div 
          className={cn(sizeClasses.icon, 'text-white relative z-10')}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          {getIcon()}
        </motion.div>
        
        {/* Glow effect on hover */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-full opacity-0",
            badgeStyle.glow
          )}
          whileHover={{ opacity: 0.5 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Subtle rim for 3D effect */}
        <div className="absolute inset-0 border border-white/20 rounded-full"></div>
      </motion.div>
      
      <h4 className="font-semibold text-center text-white">{badge.name}</h4>
      <p className="text-xs text-[#888] text-center mt-1">{badge.description}</p>
    </motion.div>
  );
}