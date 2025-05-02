import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Laptop, Headphones, Trophy, Users, Gift, ChevronLeft, ChevronRight } from 'lucide-react';

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to LearnMatrix!',
    description: 'Ready to start your personalized learning journey?',
    icon: null,
    showSkip: true
  },
  {
    id: 'profile',
    title: 'Personalize Your Experience',
    description: 'Let us customize your learning experience based on your preferences.',
    icon: null,
    showSkip: true
  },
  {
    id: 'visual-tutor',
    title: 'AI Visual Tutor',
    description: 'Learn with interactive whiteboard-style animations that make complex concepts easy to understand.',
    icon: <Laptop className="h-10 w-10 text-primary" />,
    showSkip: true
  },
  {
    id: 'audio-tutor',
    title: 'AI Audio Tutor',
    description: 'Engage with dual AI hosts in a podcast-style format. Ask questions and get real-time responses.',
    icon: <Headphones className="h-10 w-10 text-secondary" />,
    showSkip: true
  },
  {
    id: 'quiz-battle',
    title: 'Quiz Battle Arena',
    description: 'Test your knowledge in fun, competitive quizzes. Challenge yourself or compete with others.',
    icon: <Trophy className="h-10 w-10 text-[hsl(var(--accent-yellow))]" />,
    showSkip: true
  },
  {
    id: 'cohort',
    title: 'Cohorts & Gamification',
    description: 'Join learning groups, track your progress, and advance through gamified tiers from Novice to Master.',
    icon: <Users className="h-10 w-10 text-[hsl(var(--accent-green))]" />,
    showSkip: true
  },
  {
    id: 'rewards',
    title: 'Rewards & Shop',
    description: 'Earn points as you learn and redeem them for exclusive content and bonuses in the Reward Shop.',
    icon: <Gift className="h-10 w-10 text-[hsl(var(--accent-purple))]" />,
    showSkip: true
  },
  {
    id: 'dashboard',
    title: 'Your Personalized Dashboard',
    description: 'Everything you need in one place. Track progress, access courses, and stay connected with your cohort.',
    icon: null,
    showSkip: false
  }
];

type GuidedTourProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GuidedTour({ isOpen, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [learningStyle, setLearningStyle] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('');
  const [humorLevel, setHumorLevel] = useState([50]);
  const [_, navigate] = useLocation();
  
  // Reset to first step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - complete onboarding
      onClose();
      navigate('/home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const renderStepContent = () => {
    const step = tourSteps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="bg-gradient-primary text-white w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6">
              <span className="text-4xl font-bold">LM</span>
            </div>
            <h1 className="text-3xl font-bold">Welcome to LearnMatrix!</h1>
            <p className="text-lg">Ready to embark on a personalized learning journey that adapts to your unique style and preferences?</p>
            <p className="text-neutral-darker">Let's set up your experience in just a few steps.</p>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="learning-style">Preferred Learning Style</Label>
                <Select value={learningStyle} onValueChange={setLearningStyle}>
                  <SelectTrigger id="learning-style">
                    <SelectValue placeholder="Select your preferred style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual (images and videos)</SelectItem>
                    <SelectItem value="audio">Audio (podcasts and discussions)</SelectItem>
                    <SelectItem value="interactive">Interactive (quizzes and exercises)</SelectItem>
                    <SelectItem value="text">Text-based (articles and books)</SelectItem>
                    <SelectItem value="mixed">Mixed (combination of styles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="voice-style">AI Tutor Voice Style</Label>
                <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                  <SelectTrigger id="voice-style">
                    <SelectValue placeholder="Select voice style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly and Casual</SelectItem>
                    <SelectItem value="professional">Professional and Formal</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic and Energetic</SelectItem>
                    <SelectItem value="calm">Calm and Soothing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="humor-level" className="mb-2 block">Humor Level</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Serious</span>
                  <Slider
                    id="humor-level"
                    defaultValue={humorLevel}
                    max={100}
                    step={1}
                    onValueChange={setHumorLevel}
                    className="flex-1"
                  />
                  <span className="text-sm">Playful</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'visual-tutor':
        return (
          <div className="space-y-4 py-4">
            <div className="bg-[hsl(var(--muted))] rounded-xl p-6 flex flex-col items-center">
              <Laptop className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold">AI Visual Tutor</h3>
              <p className="text-center text-neutral-darker mt-2">
                Watch complex concepts come to life with animated lessons that break down difficult topics into easy-to-understand visuals.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Interactive whiteboard animations</li>
                <li>Visual concept breakdowns</li>
                <li>Highlighted key points</li>
                <li>Step-by-step demonstrations</li>
                <li>Adjustable playback speed</li>
              </ul>
            </div>
          </div>
        );
      
      case 'audio-tutor':
        return (
          <div className="space-y-4 py-4">
            <div className="bg-[hsl(var(--muted))] rounded-xl p-6 flex flex-col items-center">
              <Headphones className="h-16 w-16 text-secondary mb-4" />
              <h3 className="text-xl font-semibold">AI Audio Tutor</h3>
              <p className="text-center text-neutral-darker mt-2">
                Learn on the go with podcast-style lessons featuring dual AI hosts that engage in natural conversation and answer your questions.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Engaging podcast-style format</li>
                <li>Real-time Q&A with AI hosts</li>
                <li>Downloadable episodes</li>
                <li>Live Jam Mode for interactive sessions</li>
                <li>Voice-recognition technology</li>
              </ul>
            </div>
          </div>
        );
      
      case 'quiz-battle':
        return (
          <div className="space-y-4 py-4">
            <div className="bg-[hsl(var(--muted))] rounded-xl p-6 flex flex-col items-center">
              <Trophy className="h-16 w-16 text-[hsl(var(--accent-yellow))] mb-4" />
              <h3 className="text-xl font-semibold">Quiz Battle Arena</h3>
              <p className="text-center text-neutral-darker mt-2">
                Put your knowledge to the test with fun, competitive quizzes. Advance through ranks and climb the leaderboard.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h4 className="font-medium mb-2">Features:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Live multiplayer quiz battles</li>
                <li>Competitive ranking system</li>
                <li>Topic-specific challenges</li>
                <li>Daily and weekly tournaments</li>
                <li>Customizable difficulty levels</li>
              </ul>
            </div>
          </div>
        );
      
      case 'cohort':
        return (
          <div className="space-y-4 py-4">
            <div className="bg-[hsl(var(--muted))] rounded-xl p-6 flex flex-col items-center">
              <Users className="h-16 w-16 text-[hsl(var(--accent-green))] mb-4" />
              <h3 className="text-xl font-semibold">Cohorts & Gamification</h3>
              <p className="text-center text-neutral-darker mt-2">
                Learn together with peers in collaborative groups. Progress through tiers as you complete challenges and earn points.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h4 className="font-medium mb-2">Tier System:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><span className="font-medium">Novice Nexus:</span> Starting point for all learners</li>
                <li><span className="font-medium">Scholar Circle:</span> After consistent engagement</li>
                <li><span className="font-medium">Mentor Hive:</span> Help others while continuing your journey</li>
                <li><span className="font-medium">Expert Enclave:</span> Advanced level with special privileges</li>
                <li><span className="font-medium">Master Sphere:</span> Highest tier with exclusive access</li>
              </ul>
            </div>
          </div>
        );
      
      case 'rewards':
        return (
          <div className="space-y-4 py-4">
            <div className="bg-[hsl(var(--muted))] rounded-xl p-6 flex flex-col items-center">
              <Gift className="h-16 w-16 text-[hsl(var(--accent-purple))] mb-4" />
              <h3 className="text-xl font-semibold">Rewards & Shop</h3>
              <p className="text-center text-neutral-darker mt-2">
                Earn points as you complete lessons, quizzes, and challenges. Redeem them for exclusive content and special perks.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <h4 className="font-medium mb-2">Available Rewards:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Exclusive premium content</li>
                <li>XP boosters and multipliers</li>
                <li>Custom profile badges and themes</li>
                <li>Early access to new features</li>
                <li>Special challenge unlocks</li>
              </ul>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="space-y-6 py-8 text-center">
            <div className="bg-gradient-primary text-white w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">🎉</span>
            </div>
            <h2 className="text-2xl font-bold">You're All Set!</h2>
            <p className="text-lg">Your personalized dashboard is ready. Track your progress, access courses, and start your learning journey.</p>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-6">
              <div className="bg-[hsl(var(--muted))] p-3 rounded-lg text-center">
                <p className="font-medium">Course Progress</p>
              </div>
              <div className="bg-[hsl(var(--muted))] p-3 rounded-lg text-center">
                <p className="font-medium">Daily Challenges</p>
              </div>
              <div className="bg-[hsl(var(--muted))] p-3 rounded-lg text-center">
                <p className="font-medium">Cohort Activities</p>
              </div>
              <div className="bg-[hsl(var(--muted))] p-3 rounded-lg text-center">
                <p className="font-medium">Achievements</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="flex">
          {/* Step navigator on left side */}
          <div className="w-20 bg-[hsl(var(--muted))] flex flex-col items-center pt-8 pb-4">
            {tourSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 cursor-pointer transition-all ${index === currentStep ? 'bg-primary text-white' : 'bg-background text-neutral-darker'}`}
                onClick={() => setCurrentStep(index)}
              >
                {step.icon ? step.icon : (index + 1)}
              </div>
            ))}
          </div>
          
          {/* Content area */}
          <div className="flex-1 max-h-[80vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 z-10 bg-background pt-6 px-6 pb-2">
              <DialogTitle className="text-xl">{tourSteps[currentStep].title}</DialogTitle>
              <DialogDescription>{tourSteps[currentStep].description}</DialogDescription>
            </DialogHeader>
            
            <div className="px-6 pb-6">
              {renderStepContent()}
            </div>
            
            <DialogFooter className="sticky bottom-0 z-10 bg-background pb-6 px-6 pt-2 border-t flex justify-between">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                )}
                
                {tourSteps[currentStep].showSkip && (
                  <Button variant="ghost" onClick={handleSkip}>Skip Tour</Button>
                )}
              </div>
              
              <Button onClick={handleNext}>
                {currentStep === tourSteps.length - 1 ? 'Start Learning' : 'Next'}
                {currentStep < tourSteps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
