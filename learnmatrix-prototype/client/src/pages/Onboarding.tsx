import { useState } from 'react';
import { useLocation } from 'wouter';
import { GraduationCap, MicOff, SquareUser, Trophy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      icon: <GraduationCap className="h-16 w-16" />,
      title: "Welcome to LearnMatrix",
      description: "Your personalized AI-powered learning journey starts here!",
      color: "text-primary"
    },
    {
      icon: <MicOff className="h-16 w-16" />,
      title: "AI Audio Tutor",
      description: "Learn on the go with podcast-style lessons tailored just for you.",
      color: "text-accent-blue"
    },
    {
      icon: <SquareUser className="h-16 w-16" />,
      title: "AI Visual Tutor",
      description: "See concepts come to life with interactive whiteboard animations.",
      color: "text-accent-purple"
    },
    {
      icon: <Trophy className="h-16 w-16" />,
      title: "Quiz Battle Arena",
      description: "Challenge friends and test your knowledge in real-time quizzes.",
      color: "text-secondary"
    },
    {
      icon: <Users className="h-16 w-16" />,
      title: "Cohort Engine",
      description: "Learn together with peers who share your interests and goals.",
      color: "text-accent-green"
    }
  ];
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setLocation('/');
    }
  };
  
  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };
  
  // Map color codes to their corresponding gradients
  const getGradientClass = (color: string) => {
    switch(color) {
      case 'text-primary': return 'bg-gradient-primary';
      case 'text-secondary': return 'bg-gradient-secondary';
      case 'text-accent-blue': return 'bg-gradient-blue';
      case 'text-accent-purple': return 'bg-gradient-purple';
      case 'text-accent-green': return 'bg-gradient-green';
      case 'text-accent-yellow': return 'bg-gradient-yellow';
      default: return 'bg-gradient-primary';
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
          initial="enter"
          animate="center"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div 
            className={`mb-12 p-8 rounded-full ${slides[currentSlide].color}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotateZ: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 5, 
                ease: "easeInOut", 
                repeat: Infinity
              }}
            >
              {slides[currentSlide].icon}
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {slides[currentSlide].title}
          </motion.h1>
          
          <motion.p 
            className="text-lg text-[#aaa] mb-10 max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {slides[currentSlide].description}
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              className={`${getGradientClass(slides[currentSlide].color)} text-white rounded-full py-6 px-10 font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow`}
              onClick={handleNext}
              style={{ width: '200px' }}
            >
              {currentSlide === slides.length - 1 ? "Let's Start!" : "Next"}
            </Button>
          </motion.div>
          
          {/* Fancy pagination */}
          <div className="flex space-x-3 mt-16">
            {slides.map((slide, index) => {
              const isActive = currentSlide === index;
              const dotColor = getGradientClass(slide.color);
              
              return (
                <motion.div 
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${isActive ? dotColor : 'bg-[#222]'}`}
                  whileHover={{ scale: 1.5 }}
                  animate={isActive ? { scale: [1, 1.2, 1], opacity: 1 } : { opacity: 0.5 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setCurrentSlide(index)}
                />
              );
            })}
          </div>
          
          {/* Background decorations */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div 
              className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${getGradientClass(slides[currentSlide].color)} opacity-5 blur-3xl`}
              animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full ${getGradientClass(slides[currentSlide].color)} opacity-5 blur-3xl`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
