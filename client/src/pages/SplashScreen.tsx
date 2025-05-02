import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-navigate to welcome screen after 1.5 seconds
    const timer = setTimeout(() => {
      setLocation('/welcome');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Pulse animation behind logo */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-[#29B6F6] opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          repeat: Infinity,
          duration: 2
        }}
      />
      
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Spark icon */}
        <motion.div 
          className="mr-3"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M9 2L5.5 10H9.5L8 22L18 10H12L14 2H9Z" 
              stroke="#29B6F6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="rgba(41, 182, 246, 0.2)"
            />
          </svg>
        </motion.div>
        
        {/* LearnMatrix wordmark */}
        <h1 className="text-3xl font-bold text-white">
          Learn<span className="text-[#29B6F6]">Matrix</span>
        </h1>
      </motion.div>
      
      {/* Tip text */}
      <motion.p 
        className="text-sm font-light text-[#888] absolute bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Adaptive AI Learning, Tailored for You
      </motion.p>
    </div>
  );
}
