import { Link } from 'wouter';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { IconMap } from '@/lib/gamification';

type ModuleCardProps = {
  name: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  unreadNotifications?: number;
};

export default function ModuleCard({ 
  name, 
  description, 
  icon, 
  color, 
  path,
  unreadNotifications = 0
}: ModuleCardProps) {
  const Icon = IconMap[icon];
  
  // Map color strings to gradient classes
  const gradientMap: Record<string, string> = {
    'primary': 'bg-gradient-primary',
    'secondary': 'bg-gradient-secondary',
    'accent-blue': 'bg-gradient-blue',
    'accent-purple': 'bg-gradient-purple',
    'accent-green': 'bg-gradient-green',
    'accent-yellow': 'bg-gradient-yellow'
  };
  
  const gradient = gradientMap[color] || 'bg-gradient-primary';
  
  return (
    <Link href={path}>
      <div className="glass rounded-3xl-custom p-5 shadow-custom-md h-[180px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-custom-lg hover:translate-y-[-5px] overflow-hidden relative group">
        {/* Background accent */}
        <div className={`absolute w-32 h-32 rounded-full -top-10 -right-10 blur-xl opacity-10 ${gradient}`}></div>
        
        {/* Notification badge */}
        {unreadNotifications > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-secondary text-white rounded-full h-6 px-2 flex items-center justify-center shadow-custom-sm z-10 animate-pulse-custom">
            <span className="text-xs font-medium">{unreadNotifications} new</span>
          </div>
        )}
        
        {/* Icon with gradient background */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient} shadow-custom-sm mb-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{name}</h4>
          <p className="text-sm text-neutral-darker mt-1 line-clamp-2">{description}</p>
        </div>
        
        <div className="mt-3 flex justify-end">
          <span className="text-xs font-medium text-neutral-darker opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
            Explore <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
