import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(3);

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
    <header className="bg-white border-b border-neutral py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          LM
        </div>
        <h1 className="ml-3 text-xl font-bold">LearnMatrix</h1>
      </div>
      <div className="flex items-center">
        <div className="relative mr-4">
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
          <button 
            className="text-neutral-darker"
            onClick={() => setNotificationCount(0)}
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center">
          <span className="text-sm font-medium">{initials}</span>
        </div>
      </div>
    </header>
  );
}
