import { useLocation, useRoute, Link } from 'wouter';
import { Home, Mic, Presentation, Trophy, User, Users, Sparkles, ShoppingBag } from 'lucide-react';

export default function TabBar() {
  const [location, setLocation] = useLocation();
  
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Audio', path: '/audio-tutor', icon: Mic },
    { name: 'Visual', path: '/visual-tutor', icon: Presentation },
    { name: 'Quiz', path: '/quiz-battle', icon: Trophy },
    { name: 'Cohort', path: '/cohort', icon: Users },
    { name: 'Rewards', path: '/rewards', icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass py-2 shadow-custom-md z-40">
      <div className="max-w-screen-lg mx-auto px-2">
        <div className="flex justify-around items-center">
          {tabs.map(tab => {
            const isActive = tab.path === location;
            
            return (
              <Link 
                key={tab.name} 
                href={tab.path}
                className={`flex flex-col items-center p-2 relative ${isActive ? 'transform scale-110' : ''}`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-xl bg-neutral-light opacity-70 -z-10"></span>
                )}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                  ${isActive ? 'bg-gradient-primary shadow-custom-sm' : 'bg-transparent'} 
                  transition-all duration-300 ease-in-out`}>
                  <tab.icon className={`h-5 w-5 ${isActive ? 'text-white animate-bounce-subtle' : 'text-neutral-darker'}`} />
                </div>
                <span className={`text-xs mt-1 font-medium 
                  ${isActive ? 'text-primary' : 'text-neutral-darker'} 
                  transition-colors duration-300`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Center Button - Quick Add/Access */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <Link href="/profile">
          <button className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white shadow-custom-lg hover:shadow-custom-xl transition-all duration-300 hover:scale-110">
            <User className="h-6 w-6" />
          </button>
        </Link>
      </div>
    </nav>
  );
}
