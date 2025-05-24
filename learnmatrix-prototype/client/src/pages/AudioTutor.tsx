import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Lesson } from '@shared/schema';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AudioTutor() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(255); // 4:15 in seconds
  const [, setLocation] = useLocation();
  
  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['/api/modules/1/lessons'],
  });
  
  const currentLesson = lessons[0] || {
    id: 1, 
    title: 'Introduction to Neural Networks',
    duration: 765, // 12:45 in seconds
    moduleId: 1,
    completed: false,
    userId: 1
  };
  
  const upcomingLessons = lessons.slice(1) || [];
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = (currentTime / currentLesson.duration) * 100;
  
  return (
    <div className="p-6 bg-black min-h-[calc(100vh-8rem)]">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">AI Audio Tutor</h2>
            <p className="text-[#888]">Listen and learn at your own pace</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="bg-gradient-purple hover:bg-purple-600 text-white"
              onClick={() => setLocation('/audio-mvp')}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Try MVP Version
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Currently Playing */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] rounded-xl p-6 shadow-md border border-[#333] mb-6"
        whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      >
        <h3 className="font-semibold mb-4 text-white">Now Playing</h3>
        <div className="flex items-center mb-6">
          <motion.div 
            className="bg-gradient-blue rounded-xl w-16 h-16 flex items-center justify-center text-white text-2xl mr-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: ['0 0 0 rgba(59, 130, 246, 0)', '0 0 20px rgba(59, 130, 246, 0.5)', '0 0 0 rgba(59, 130, 246, 0)'] 
            }}
            transition={{ 
              boxShadow: { repeat: Infinity, duration: 2 }, 
              scale: { type: 'spring', stiffness: 300, damping: 10 } 
            }}
          >
            <MicrophoneStage />
          </motion.div>
          <div>
            <h4 className="font-medium text-white">{currentLesson.title}</h4>
            <p className="text-sm text-[#888]">Part 2 of 5 • {formatTime(currentLesson.duration)}</p>
          </div>
        </div>
        
        {/* Visualizer - Optimized for performance */}
        <div className="flex h-8 items-end space-x-0.5 mb-4">
          {Array.from({ length: 30 }).map((_, i) => { // Reduced number of bars
            // Create a wave pattern with Math.sin
            const height = Math.abs(Math.sin((i + currentTime) * 0.2)) * 100;
            const displayHeight = isPlaying ? height : height * 0.3;
            
            return (
              <div 
                key={i}
                className={`w-1 ${isPlaying ? 'bg-gradient-primary' : 'bg-[#333]'} rounded-t transition-all duration-200`}
                style={{ 
                  height: `${displayHeight}%`,
                  opacity: isPlaying ? 1 : 0.5
                }}
              />
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-[#222] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <div className="flex justify-between text-xs text-[#888] mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentLesson.duration)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center items-center space-x-8">
          <motion.button 
            className="text-[#888] text-xl p-2"
            whileHover={{ scale: 1.1, color: '#fff' }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipBack className="h-6 w-6" />
          </motion.button>
          <motion.button 
            className="bg-gradient-blue rounded-full w-14 h-14 flex items-center justify-center text-white text-lg shadow-lg glow-primary"
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </motion.button>
          <motion.button 
            className="text-[#888] text-xl p-2"
            whileHover={{ scale: 1.1, color: '#fff' }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="h-6 w-6" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Upcoming Episodes - Performance Optimized */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-semibold mb-4 text-white">Up Next</h3>
        <div className="space-y-3">
          {upcomingLessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              className="bg-[#111] rounded-xl p-4 shadow-md border border-[#222] flex items-center hover:border-[#333] hover:bg-[#161616] transition-colors"
            >
              <div 
                className="bg-[#222] rounded-lg w-10 h-10 flex items-center justify-center text-[#888] mr-4 hover:bg-[#3B82F6] hover:text-white transition-colors"
              >
                <Play className="h-4 w-4 ml-0.5" />
              </div>
              <div>
                <h4 className="font-medium text-white">{lesson.title}</h4>
                <p className="text-xs text-[#888]">Part {index + 3} of 5 • {formatTime(lesson.duration)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MicrophoneStage() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
