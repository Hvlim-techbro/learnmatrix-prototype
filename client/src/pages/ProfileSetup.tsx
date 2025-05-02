import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Headphones, MessageSquare, MonitorPlay, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Step = 'details' | 'preferences';

export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('details');
  
  // Personal details state
  const [name, setName] = useState('');
  const [ageBracket, setAgeBracket] = useState('');
  const [country, setCountry] = useState('');
  
  // Goals & preferences state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState('');
  
  const goals = [
    'Career Growth', 'Academic Success', 'Personal Interest', 'Skill Building', 'Certification Prep'
  ];
  
  const modes = [
    { id: 'audio', label: 'Audio', icon: <Headphones className="h-5 w-5" /> },
    { id: 'visual', label: 'Visual', icon: <MonitorPlay className="h-5 w-5" /> },
    { id: 'quiz', label: 'Quiz', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'cohort', label: 'Cohort', icon: <Users className="h-5 w-5" /> },
  ];
  
  const timeOptions = ['<2 hrs/wk', '2-5 hrs/wk', '5-10 hrs/wk', '>10 hrs/wk'];
  
  const handleGoalToggle = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };
  
  const handleModeToggle = (mode: string) => {
    if (selectedModes.includes(mode)) {
      setSelectedModes(selectedModes.filter(m => m !== mode));
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setTimeCommitment(time);
  };
  
  const handleNext = () => {
    if (step === 'details') {
      setStep('preferences');
    } else {
      // Save profile and navigate to plan selection
      setLocation('/plan-selection');
    }
  };
  
  const handleBack = () => {
    if (step === 'preferences') {
      setStep('details');
    } else {
      setLocation('/signup');
    }
  };
  
  const handleSkip = () => {
    if (step === 'details') {
      setStep('preferences');
    } else {
      setLocation('/plan-selection');
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-black relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <motion.button 
          className="p-2 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </motion.button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          key={step}
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-[24px] font-semibold text-white mb-2 text-center">
            {step === 'details' ? 'Create Your Profile' : 'Your Goals & Style'}
          </h1>
          
          <p className="text-[16px] text-[#888] mb-8 text-center">
            {step === 'details' 
              ? 'Tell us a bit about yourself' 
              : 'Help us personalize your learning experience'}
          </p>
          
          {step === 'details' ? (
            // Personal Details Form
            <div className="bg-[#1E1E1E] border border-[#333] rounded-lg p-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#CCC] mb-1 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#282828] border-[#444] h-12 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#CCC] mb-1 block">Age Bracket</label>
                  <Select value={ageBracket} onValueChange={setAgeBracket}>
                    <SelectTrigger className="bg-[#282828] border-[#444] h-12 text-white">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#444] text-white">
                      <SelectItem value="under18">Under 18</SelectItem>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45plus">45+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-[#CCC] mb-1 block">Country</label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="bg-[#282828] border-[#444] h-12 text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#444] text-white max-h-60">
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="gh">Ghana</SelectItem>
                      <SelectItem value="ke">Kenya</SelectItem>
                      <SelectItem value="za">South Africa</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            // Goals & Preferences Form
            <div className="space-y-6">
              {/* Goal Chips */}
              <div>
                <h3 className="text-[16px] font-medium text-white mb-3">Your Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {goals.map((goal) => (
                    <button
                      key={goal}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedGoals.includes(goal) 
                        ? 'bg-[#29B6F6] text-white' 
                        : 'bg-[#1E1E1E] text-[#29B6F6] border border-[#29B6F6]/50'}`}
                      onClick={() => handleGoalToggle(goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Learning Mode Toggles */}
              <div>
                <h3 className="text-[16px] font-medium text-white mb-3">Preferred Learning Modes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${selectedModes.includes(mode.id) 
                        ? 'bg-[#29B6F6] text-white' 
                        : 'bg-[#1E1E1E] text-[#888] border border-[#333]'}`}
                      onClick={() => handleModeToggle(mode.id)}
                    >
                      {mode.icon}
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Time Commitment */}
              <div>
                <h3 className="text-[16px] font-medium text-white mb-3">Time Commitment</h3>
                <div className="flex flex-wrap gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${timeCommitment === time 
                        ? 'bg-[#29B6F6] text-white' 
                        : 'bg-[#1E1E1E] text-[#888] border border-[#333]'}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-between items-center">
            <button 
              className="text-[#888] text-sm hover:text-white transition-colors"
              onClick={handleSkip}
            >
              Skip
            </button>
            
            <Button 
              className="bg-[#29B6F6] hover:bg-[#29B6F6]/90 text-white px-8 py-6 rounded-full flex items-center gap-2"
              onClick={handleNext}
            >
              {step === 'details' ? 'Next' : 'Save & Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
