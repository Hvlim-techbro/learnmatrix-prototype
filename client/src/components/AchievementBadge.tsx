import { Badge } from '@shared/schema';
import { Award, Zap, Trophy, Flame, Medal, Star } from 'lucide-react';

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
  
  // Map badge color string to gradient class
  const getGradientClass = () => {
    switch(badge.color) {
      case 'primary': return 'bg-gradient-primary';
      case 'secondary': return 'bg-gradient-secondary';
      case 'accent-blue': return 'bg-gradient-blue';
      case 'accent-purple': return 'bg-gradient-purple';
      case 'accent-green': return 'bg-gradient-green';
      case 'accent-yellow': return 'bg-gradient-yellow';
      default: return 'bg-gradient-primary';
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
  const gradientClass = getGradientClass();
  
  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses.container} rounded-full ${gradientClass} flex items-center justify-center shadow-custom-md mb-2 relative overflow-hidden animate-bounce-subtle`}>
        {/* Background pattern for more visual interest */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white"></div>
          <div className="absolute top-1/2 right-3 w-6 h-6 rounded-full bg-white"></div>
          <div className="absolute bottom-2 left-1/2 w-4 h-4 rounded-full bg-white"></div>
        </div>
        
        {/* Icon */}
        <div className={`${sizeClasses.icon} text-white relative z-10`}>
          {getIcon()}
        </div>
        
        {/* Subtle rim for 3D effect */}
        <div className="absolute inset-0 border border-white/20 rounded-full"></div>
      </div>
      
      <h4 className="font-semibold text-center">{badge.name}</h4>
      <p className="text-xs text-neutral-darker text-center mt-1">{badge.description}</p>
    </div>
  );
}