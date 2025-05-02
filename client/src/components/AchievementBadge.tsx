import { Badge } from '@shared/schema';
import { IconMap } from '@/lib/gamification';

type AchievementBadgeProps = {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
};

export default function AchievementBadge({ badge, size = 'md' }: AchievementBadgeProps) {
  const Icon = IconMap[badge.icon] || IconMap.medal;
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} rounded-full bg-${badge.color} text-white flex items-center justify-center mb-1`}>
        <Icon />
      </div>
      <span className="text-xs text-center">{badge.name}</span>
    </div>
  );
}
