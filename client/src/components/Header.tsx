import { useState } from 'react';
import { Bell, Sparkles, Search, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  // Get initials from display name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const initials = user ? getInitials(user.displayName) : 'LM';

  return (
    <header className="sticky top-0 z-50 py-3 px-4 flex justify-between items-center bg-black border-b border-[#222]">
      <div className="flex items-center">
        <Link href="/">
          <motion.div 
            className="flex items-center cursor-pointer" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-custom-sm animate-pulse-custom">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-primary">LearnMatrix</h1>
          </motion.div>
        </Link>
      </div>
      
      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/courses">
          <span className="text-[#888] hover:text-primary transition-colors">Courses</span>
        </Link>
        <Link href="/cohort">
          <span className="text-[#888] hover:text-primary transition-colors">Cohorts</span>
        </Link>
        <Link href="/rewards">
          <span className="text-[#888] hover:text-primary transition-colors">Rewards</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#888]" />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#111] pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-40 lg:w-64 transition-all duration-300 border border-[#333]"
          />
        </div>
        
        <motion.div 
          className="relative" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-custom-sm animate-pulse-custom glow-secondary">
              {notificationCount}
            </span>
          )}
          <button 
            className="p-2 rounded-full hover:bg-[#222] transition-colors"
            onClick={() => setNotificationCount(0)}
          >
            <Bell className="h-5 w-5 text-[#888]" />
          </button>
        </motion.div>
        
        <Link href="/profile">
          <motion.div 
            className="w-9 h-9 rounded-full bg-gradient-blue text-white flex items-center justify-center cursor-pointer shadow-custom-sm hover:shadow-custom-md transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">{initials}</span>
          </motion.div>
        </Link>
        
        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 rounded-full hover:bg-[#222] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="h-5 w-5 text-[#888]" />
        </motion.button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="absolute top-full left-0 right-0 mt-1 p-4 bg-[#111] border border-[#222] rounded-b-lg shadow-custom-md md:hidden z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col space-y-4">
            <Link href="/courses">
              <span className="block p-2 rounded hover:bg-[#222] transition-colors text-[#888] hover:text-primary">Courses</span>
            </Link>
            <Link href="/cohort">
              <span className="block p-2 rounded hover:bg-[#222] transition-colors text-[#888] hover:text-primary">Cohorts</span>
            </Link>
            <Link href="/rewards">
              <span className="block p-2 rounded hover:bg-[#222] transition-colors text-[#888] hover:text-primary">Rewards</span>
            </Link>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#888]" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#222] pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full transition-all duration-300 border border-[#333]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
