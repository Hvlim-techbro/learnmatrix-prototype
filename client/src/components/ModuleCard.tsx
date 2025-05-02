import { Link } from 'wouter';
import { LucideIcon } from 'lucide-react';
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
  
  return (
    <Link href={path}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral h-40 flex flex-col justify-between cursor-pointer transition duration-200 hover:shadow-md">
        <div className={`text-${color} text-2xl mb-2`}>
          <Icon />
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-xs text-neutral-darker mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
