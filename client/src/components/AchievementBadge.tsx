import { Badge } from '@shared/schema';
import { Award, Zap, Trophy, Flame, Medal, Star } from 'lucide-react';

type AchievementBadgeProps = {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
};

export default function AchievementBadge({ badge, size = 'md' }: AchievementBadgeProps) {
  // Map badge icon string to component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'fire': Fire,
      'zap': Zap,
      'trophy': Trophy,
      'award': Award,
      'medal': Medal,
      'star': Star
    };
    
    return iconMap[iconName] || Award;
  };
  
  const IconComponent = getIconComponent(badge.icon);
  
  // Map badge color string to gradient class
  const getGradientClass = (color: string) => {
    const gradientMap: Record<string, string> = {
      'primary': 'bg-gradient-primary',
      'secondary': 'bg-gradient-secondary',
      'accent-blue': 'bg-gradient-blue',
      'accent-purple': 'bg-gradient-purple',
      'accent-green': 'bg-gradient-green',
      'accent-yellow': 'bg-gradient-yellow'
    };
    
    return gradientMap[color] || 'bg-gradient-primary';
  };
  
  const gradientClass = getGradientClass(badge.color);
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      icon: 'h-6 w-6'
    },
    md: {
      container: 'w-20 h-20',
      icon: 'h-8 w-8'
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'h-10 w-10'
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size].container} rounded-full ${gradientClass} flex items-center justify-center shadow-custom-md mb-2 relative overflow-hidden animate-bounce-subtle`}>
        {/* Background pattern for more visual interest */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white"></div>
          <div className="absolute top-1/2 right-3 w-6 h-6 rounded-full bg-white"></div>
          <div className="absolute bottom-2 left-1/2 w-4 h-4 rounded-full bg-white"></div>
        </div>
        
        {/* Icon */}
        <IconComponent className={`${sizeClasses[size].icon} text-white relative z-10`} />
        
        {/* Subtle rim for 3D effect */}
        <div className="absolute inset-0 border border-white/20 rounded-full"></div>
      </div>
      
      <h4 className="font-semibold text-center">{badge.name}</h4>
      <p className="text-xs text-neutral-darker text-center mt-1">{badge.description}</p>
    </div>
  );
}