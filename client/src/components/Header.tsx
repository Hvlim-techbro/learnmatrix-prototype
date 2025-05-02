import { useState } from 'react';
import { Bell, Sparkles, Search, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Link } from 'wouter';

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
    <header className="glass sticky top-0 z-50 py-4 px-6 flex justify-between items-center shadow-custom-sm">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-custom-sm animate-bounce-subtle">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-primary">LearnMatrix</h1>
          </div>
        </Link>
      </div>
      
      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/courses">
          <span className="text-neutral-darker hover:text-primary transition-colors">Courses</span>
        </Link>
        <Link href="/cohort">
          <span className="text-neutral-darker hover:text-primary transition-colors">Cohorts</span>
        </Link>
        <Link href="/rewards">
          <span className="text-neutral-darker hover:text-primary transition-colors">Rewards</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-dark" />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-neutral-light pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-40 lg:w-64 transition-all duration-300"
          />
        </div>
        
        <div className="relative">
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-custom-sm animate-pulse-custom">
              {notificationCount}
            </span>
          )}
          <button 
            className="p-2 rounded-full hover:bg-neutral-light transition-colors"
            onClick={() => setNotificationCount(0)}
          >
            <Bell className="h-5 w-5 text-neutral-darker" />
          </button>
        </div>
        
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full bg-gradient-blue text-white flex items-center justify-center cursor-pointer shadow-custom-sm hover:shadow-custom-md transition-all duration-300">
            <span className="text-sm font-medium">{initials}</span>
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-neutral-light transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5 text-neutral-darker" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 glass rounded-b-2xl animate-slide-up shadow-custom-md md:hidden">
          <div className="flex flex-col space-y-4">
            <Link href="/courses">
              <span className="block p-2 rounded hover:bg-neutral-light transition-colors">Courses</span>
            </Link>
            <Link href="/cohort">
              <span className="block p-2 rounded hover:bg-neutral-light transition-colors">Cohorts</span>
            </Link>
            <Link href="/rewards">
              <span className="block p-2 rounded hover:bg-neutral-light transition-colors">Rewards</span>
            </Link>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-dark" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-neutral-light pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
