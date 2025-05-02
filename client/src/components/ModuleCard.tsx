import { Link } from 'wouter';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { IconMap } from '@/lib/gamification';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  // Map color strings to gradient classes and glow effects
  const gradientMap: Record<string, {gradient: string, glow: string}> = {
    'primary': {gradient: 'bg-gradient-primary', glow: 'glow-primary'},
    'secondary': {gradient: 'bg-gradient-secondary', glow: 'glow-secondary'},
    'accent-blue': {gradient: 'bg-gradient-blue', glow: 'glow-primary'},
    'accent-purple': {gradient: 'bg-gradient-purple', glow: 'glow-secondary'},
    'accent-green': {gradient: 'bg-gradient-green', glow: 'glow-green'},
    'accent-yellow': {gradient: 'bg-gradient-yellow', glow: 'glow-yellow'}
  };
  
  const colorStyle = gradientMap[color] || gradientMap['primary'];
  
  return (
    <Link href={path}>
      <motion.div 
        className="bg-[#1E1E1E] border border-[#333] rounded-xl p-5 h-[180px] flex flex-col justify-between cursor-pointer relative group overflow-hidden"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Animated gradient background on hover */}
        <motion.div 
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10",
            colorStyle.gradient
          )}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.1 }}
        />
        
        {/* Subtle glow on border when hovered */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            colorStyle.glow
          )}
        />
        
        {/* Notification badge with animation */}
        {unreadNotifications > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-secondary text-white rounded-full h-6 px-2 flex items-center justify-center z-10 animate-pulse-custom shadow-md">
            <span className="text-xs font-medium">{unreadNotifications} new</span>
          </div>
        )}
        
        {/* Icon with gradient background */}
        <motion.div 
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shadow-md mb-3",
            colorStyle.gradient
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-white">{name}</h4>
          <p className="text-sm text-[#888] mt-1 line-clamp-2">{description}</p>
        </div>
        
        <motion.div 
          className="mt-3 flex justify-end"
          initial={{ x: -10, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          <span className="text-xs font-medium text-primary flex items-center">
            Explore <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}
