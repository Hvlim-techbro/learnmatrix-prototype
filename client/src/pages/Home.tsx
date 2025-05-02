import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Module, Challenge, User } from '@shared/schema';
import ProgressCard from '@/components/ProgressCard';
import ModuleCard from '@/components/ModuleCard';
import ChallengeCard from '@/components/ChallengeCard';

export default function Home() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const { data: dailyChallenges = [] } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges/daily'],
  });

  const getModulePath = (name: string): string => {
    const paths: { [key: string]: string } = {
      'AI Audio Tutor': '/audio-tutor',
      'AI Visual Tutor': '/visual-tutor',
      'Quiz Battle Arena': '/quiz-battle',
      'Cohort Engine': '/cohort',
      'Curriculum Composer': '/',
      'BEYOND': '/',
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
    <div className="p-6">
      {/* Welcome and Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Hi, {user?.displayName?.split(' ')[0] || 'Jordan'}! 👋</h2>
        <p className="text-neutral-darker">Pick up where you left off</p>
        
        <ProgressCard />
      </div>
      
      {/* Daily Challenges */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Daily Challenges</h3>
          <a href="#" className="text-sm text-primary">See All</a>
        </div>
        <div className="space-y-3">
          {dailyChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
      
      {/* Learning Modules */}
      <div>
        <h3 className="font-semibold mb-4">Your Learning Modules</h3>
        <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
