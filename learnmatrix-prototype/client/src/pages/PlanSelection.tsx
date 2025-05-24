import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanSelection() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  
  const handlePlanSelect = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
  };
  
  const handleContinue = () => {
    if (selectedPlan) {
      setShowLoader(true);
      
      // Simulate loading process and mark onboarding as complete
      setTimeout(() => {
        // Set the flag to indicate onboarding flow is complete
        localStorage.setItem("learnMatrixOnboardingCompleted", "true");
        setShowLoader(false);
        setLocation('/');
      }, 2000);
    }
  };
  
  const handleBack = () => {
    setLocation('/profile-setup');
  };
  
  const freeFeatures = [
    'Limited daily lessons',
    'Basic AI tutors',
    'Access to quiz battles',
    'Progress tracking',
  ];
  
  const proFeatures = [
    'Unlimited daily lessons',
    'Advanced AI tutors',
    'Priority quiz matching',
    'Full cohort access',
    'Personalized curriculum',
    'Download lessons offline',
    'No ads',
  ];
  
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
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[24px] font-semibold text-white mb-2 text-center">
            Choose Your Plan
          </h1>
          
          <p className="text-[16px] text-[#888] mb-8 text-center">
            Select the plan that works best for you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Freemium Card */}
            <motion.div 
              className={`bg-[#1E1E1E] border ${selectedPlan === 'free' ? 'border-[#29B6F6]' : 'border-[#333]'} rounded-xl p-6 cursor-pointer relative overflow-hidden`}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
              onClick={() => handlePlanSelect('free')}
            >
              {selectedPlan === 'free' && (
                <motion.div 
                  className="absolute top-4 right-4 bg-[#29B6F6] rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
              
              <h3 className="text-[18px] font-semibold text-white mb-2">Freemium</h3>
              <p className="text-[#CCC] mb-6">Basic features for casual learners</p>
              
              <p className="text-2xl font-bold text-white mb-6">Free</p>
              
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-[#29B6F6] mr-2 shrink-0 mt-0.5" />
                    <span className="text-[#CCC]">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-6 rounded-xl ${selectedPlan === 'free' 
                  ? 'bg-[#29B6F6] text-white' 
                  : 'bg-transparent border border-[#29B6F6] text-[#29B6F6]'}`}
                onClick={() => handlePlanSelect('free')}
              >
                Start Free
              </Button>
            </motion.div>
            
            {/* Pro Card */}
            <motion.div 
              className={`bg-[#1E1E1E] border ${selectedPlan === 'pro' ? 'border-[#29B6F6]' : 'border-[#333]'} rounded-xl p-6 cursor-pointer relative overflow-hidden shadow-lg`}
              whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }}
              onClick={() => handlePlanSelect('pro')}
            >
              {/* Recommended badge */}
              <div className="absolute -right-8 top-6 bg-[#FF6B6B] py-1 px-10 transform rotate-45 text-xs font-semibold text-white">
                RECOMMENDED
              </div>
              
              {selectedPlan === 'pro' && (
                <motion.div 
                  className="absolute top-4 right-4 bg-[#29B6F6] rounded-full p-1 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
              
              <h3 className="text-[18px] font-semibold text-white mb-2">Pro</h3>
              <p className="text-[#CCC] mb-6">Enhanced learning experience</p>
              
              <div className="flex items-baseline mb-6">
                <p className="text-2xl font-bold text-white">$12</p>
                <span className="text-[#CCC] ml-1">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-[#29B6F6] mr-2 shrink-0 mt-0.5" />
                    <span className="text-[#CCC]">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-6 rounded-xl ${selectedPlan === 'pro' 
                  ? 'bg-[#FF6B6B] text-white' 
                  : 'bg-transparent border border-[#FF6B6B] text-[#FF6B6B]'}`}
                onClick={() => handlePlanSelect('pro')}
              >
                Go Pro
              </Button>
            </motion.div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              className="bg-[#29B6F6] hover:bg-[#29B6F6]/90 text-white px-8 py-6 rounded-full w-full max-w-xs"
              onClick={handleContinue}
              disabled={!selectedPlan || showLoader}
            >
              {showLoader ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {showLoader && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-12 h-12 border-4 border-[#29B6F6] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white mt-4">Setting up your learning space...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
