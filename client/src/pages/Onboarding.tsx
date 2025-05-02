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
  
  return (
    <div className="h-screen w-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className="h-full flex flex-col items-center justify-center p-8 text-center"
          initial="enter"
          animate="center"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.3 }}
        >
          <div className={`mb-12 ${slides[currentSlide].color}`}>
            {slides[currentSlide].icon}
          </div>
          <h1 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-lg text-neutral-darker mb-8">{slides[currentSlide].description}</p>
          <Button
            className="bg-primary text-white rounded-full py-3 px-8 font-semibold"
            onClick={handleNext}
          >
            {currentSlide === slides.length - 1 ? "Let's Get Started!" : "Next"}
          </Button>
          
          {/* Pagination dots */}
          <div className="flex space-x-2 mt-12">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${currentSlide === index ? 'bg-primary' : 'bg-neutral'}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
