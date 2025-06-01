import { useLocation, Link } from 'wouter';
import { Home, Mic, Presentation, Trophy, User, Users, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function TabBar() {
  const [location] = useLocation();

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Audio', path: '/audio-tutor', icon: Mic },
    { name: 'Visual', path: '/visual-tutor', icon: Presentation },
    { name: 'Quiz', path: '/quiz-battle', icon: Trophy },
    { name: 'Cohort', path: '/cohort', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#333] z-50">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab, index) => {
          const isActive = tab.path === location;

          return (
            <Link 
              key={tab.name} 
              href={tab.path}
              className="relative flex flex-col items-center justify-center"
            >
              {isActive && (
                <motion.div 
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-lg bg-[#222] z-0"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={cn(
                "flex flex-col items-center justify-center w-full h-full z-10 transition-all",
                isActive ? "text-primary scale-110" : "text-[#888]"
              )}>
                <tab.icon className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-primary" : "text-[#888]"
                )} />
                <span className="text-xs font-medium">{tab.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Center Button - Profile Access */}
      <motion.div 
        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/profile">
          <button className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300 hover:glow-primary">
            <User className="h-6 w-6" />
          </button>
        </Link>
      </motion.div>
    </nav>
  );
}