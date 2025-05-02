import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation('/signup');
  };

  const handleWatchDemo = () => {
    // Future feature: open demo video
    console.log('Watch demo clicked');
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1E1E1E] relative overflow-hidden">
      {/* Navigation hint */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button 
          className="p-2 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="h-6 w-6" />
        </motion.button>
      </div>
      
      {/* Abstract line art illustration */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          className="w-64 h-64 mb-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Abstract line art with cyan highlights */}
          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Brain network abstract illustration */}
            <path d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20Z" stroke="#333" strokeWidth="2" />
            <path d="M60 80C60 69 69 60 80 60C91 60 100 69 100 80C100 91 91 100 80 100C69 100 60 91 60 80Z" stroke="#555" strokeWidth="2" />
            <path d="M100 100C100 89 109 80 120 80C131 80 140 89 140 100C140 111 131 120 120 120C109 120 100 111 100 100Z" stroke="#555" strokeWidth="2" />
            <path d="M80 140C80 129 89 120 100 120C111 120 120 129 120 140C120 151 111 160 100 160C89 160 80 151 80 140Z" stroke="#555" strokeWidth="2" />
            
            {/* Cyan highlight paths */}
            <path d="M80 100L100 120" stroke="#29B6F6" strokeWidth="2" />
            <path d="M120 120L120 80" stroke="#29B6F6" strokeWidth="2" />
            <path d="M80 60L120 80" stroke="#29B6F6" strokeWidth="2" />
            
            {/* Animated elements */}
            <motion.circle 
              cx="80" 
              cy="80" 
              r="5" 
              fill="#29B6F6"
              animate={{
                opacity: [0.5, 1, 0.5],
                r: [4, 6, 4],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.circle 
              cx="120" 
              cy="100" 
              r="5" 
              fill="#29B6F6"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                r: [3, 5, 3],
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
            <motion.circle 
              cx="100" 
              cy="140" 
              r="5" 
              fill="#29B6F6"
              animate={{
                opacity: [0.4, 0.9, 0.4],
                r: [3, 6, 3],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
        
        <motion.h1 
          className="text-[28px] font-semibold text-white mb-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Learn Smarter. Anywhere.
        </motion.h1>
        
        <motion.p 
          className="text-[16px] text-[#CCC] mb-8 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Podcast-style, whiteboard visuals & community challenges.
        </motion.p>
        
        <motion.div 
          className="flex flex-col space-y-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            className="bg-[#29B6F6] hover:bg-[#29B6F6]/90 text-white py-6 w-full rounded-full text-[16px]"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
          
          <button 
            className="text-[#29B6F6] hover:text-[#29B6F6]/80 text-[16px] font-medium"
            onClick={handleWatchDemo}
          >
            Watch Demo
          </button>
        </motion.div>
      </div>
    </div>
  );
}
