import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Module, Challenge, User, Badge } from '@shared/schema';
import ProgressCard from '@/components/ProgressCard';
import ModuleCard from '@/components/ModuleCard';
import ChallengeCard from '@/components/ChallengeCard';
import GuidedTour from '@/components/GuidedTour';
import { Calendar, Zap, Flame, Award, ChevronRight, BookOpen, Activity, TrendingUp, HelpCircle } from 'lucide-react';
import AchievementBadge from '@/components/AchievementBadge';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showTour, setShowTour] = useState(false);

  // Show the tour when component mounts
  useEffect(() => {
    // Check if this is the first time the user visits
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const { data: dailyChallenges = [] } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges/daily'],
  });
  
  const { data: badges = [] } = useQuery<Badge[]>({
    queryKey: ['/api/user/badges'],
  });

  const getModulePath = (name: string): string => {
    const paths: { [key: string]: string } = {
      'AI Audio Tutor': '/audio-tutor',
      'AI Visual Tutor': '/visual-tutor',
      'Quiz Battle Arena': '/quiz-battle',
      'Cohort Engine': '/cohort',
      'Curriculum Composer': '/courses',
      'BEYOND': '/courses',
    };
    
    return paths[name] || '/';
  };

  const getModuleDescription = (name: string, desc: string): string => {
    const customDescriptions: { [key: string]: string } = {
      'AI Audio Tutor': 'Continue your lesson on Neural Networks',
      'AI Visual Tutor': 'Explore whiteboard diagrams for deep learning',
      'Quiz Battle Arena': '5 players online now in your tier',
      'Cohort Engine': 'New message from your Scholar Circle',
      'Curriculum Composer': 'Your new learning path is ready',
      'BEYOND': 'New research material unlocked',
    };
    
    return customDescriptions[name] || desc;
  };

  return (
    <div className="p-6 bg-black">
      {/* Guided Tour */}
      <GuidedTour isOpen={showTour} onClose={() => setShowTour(false)} />
      
      {/* Help button to re-open the tour */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowTour(true)}
          className="rounded-full w-12 h-12 bg-gradient-primary shadow-custom-lg flex items-center justify-center"
        >
          <HelpCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
      {/* Welcome Section - Hero */}
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-primary">Hi, {user?.displayName?.split(' ')[0] || 'Jordan'}! 👋</h1>
            <p className="text-neutral-darker text-lg">Welcome back to your learning journey</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="glass rounded-xl p-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-custom-sm mr-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-neutral-darker">Today</div>
                <div className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            </div>
            <div className="glass rounded-xl p-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-yellow flex items-center justify-center shadow-custom-sm mr-2">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-neutral-darker">Streak</div>
                <div className="text-sm font-semibold">{user?.streak || 0} days</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Card */}
        <ProgressCard />
      </div>
      
      {/* Quick Resume Section */}
      <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-blue flex items-center justify-center shadow-custom-sm mr-2">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Continue Learning</h2>
          </div>
          <a href="/courses" className="flex items-center text-sm text-primary hover:underline transition-all duration-300">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        <div className="glass rounded-2xl-custom p-4 shadow-custom-md relative overflow-hidden group cursor-pointer hover:shadow-custom-lg transition-all duration-300">
          {/* Background decoration */}
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-gradient-blue opacity-10 blur-xl"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-blue flex items-center justify-center shadow-custom-sm mr-4 flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Neural Networks</h3>
                <span className="text-xs text-neutral-darker">25 min left</span>
              </div>
              <p className="text-sm text-neutral-darker mt-1">Continue where you left off in Audio Tutor</p>
              
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-accent-blue" />
                    Progress
                  </span>
                  <span className="text-xs">65%</span>
                </div>
                <div className="h-1.5 bg-neutral-light rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-blue rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-custom-md">
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Challenges */}
      <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shadow-custom-sm mr-2">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Daily Challenges</h2>
          </div>
          <span className="text-sm text-primary">{dailyChallenges.length} Available</span>
        </div>
        
        <div className="space-y-4">
          {dailyChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
      
      {/* Learning Modules Grid */}
      <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-custom-sm mr-2">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Learning Modules</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map(module => (
            <ModuleCard 
              key={module.id}
              name={module.name}
              description={getModuleDescription(module.name, module.description)}
              icon={module.icon}
              color={module.color} 
              path={getModulePath(module.name)}
              unreadNotifications={module.unreadNotifications}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Achievements */}
      {badges.length > 0 && (
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-yellow flex items-center justify-center shadow-custom-sm mr-2">
                <Award className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Recent Achievements</h2>
            </div>
            <a href="/profile" className="flex items-center text-sm text-primary hover:underline transition-all duration-300">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="glass rounded-2xl-custom p-6 shadow-custom-md overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-yellow opacity-10 blur-xl"></div>
            
            <div className="flex flex-wrap gap-4 relative z-10">
              {badges.slice(0, 3).map(badge => (
                <div key={badge.id} className="glass rounded-xl p-3 flex items-center flex-1 min-w-[200px]">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-${badge.color === 'accent-yellow' ? 'yellow' : 'blue'} flex items-center justify-center shadow-custom-sm mr-3`}>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{badge.name}</div>
                    <p className="text-xs text-neutral-darker mt-1">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
