import { useLocation, useRoute, Link } from 'wouter';
import { Home, Mic, Presentation, Trophy, User } from 'lucide-react';

export default function TabBar() {
  const [location, setLocation] = useLocation();
  
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Audio', path: '/audio-tutor', icon: Mic },
    { name: 'Visual', path: '/visual-tutor', icon: Presentation },
    { name: 'Quiz', path: '/quiz-battle', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral py-2">
      <div className="flex justify-around items-center">
        {tabs.map(tab => {
          const isActive = tab.path === location;
          const textColor = isActive ? 'text-primary font-medium' : 'text-neutral-darker';
          
          return (
            <Link 
              key={tab.name} 
              href={tab.path}
              className={`flex flex-col items-center w-1/5 p-2 ${textColor}`}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-neutral-darker'}`} />
              <span className={`text-xs mt-1 ${textColor}`}>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
