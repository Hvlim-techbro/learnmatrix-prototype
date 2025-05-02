import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Lesson } from '@shared/schema';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AudioTutor() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(255); // 4:15 in seconds
  
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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">AI Audio Tutor</h2>
        <p className="text-neutral-darker">Listen and learn at your own pace</p>
      </div>
      
      {/* Currently Playing */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-neutral mb-6"
      >
        <h3 className="font-semibold mb-4">Now Playing</h3>
        <div className="flex items-center mb-4">
          <div className="bg-primary rounded-xl w-16 h-16 flex items-center justify-center text-white text-2xl mr-4">
            <MicrophoneStage />
          </div>
          <div>
            <h4 className="font-medium">{currentLesson.title}</h4>
            <p className="text-sm text-neutral-darker">Part 2 of 5 • {formatTime(currentLesson.duration)}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-neutral-light rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <div className="flex justify-between text-xs text-neutral-darker mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentLesson.duration)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-between items-center">
          <button className="text-neutral-darker text-xl">
            <SkipBack className="h-6 w-6" />
          </button>
          <button 
            className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white text-lg"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
          <button className="text-neutral-darker text-xl">
            <SkipForward className="h-6 w-6" />
          </button>
        </div>
      </motion.div>
      
      {/* Upcoming Episodes */}
      <div>
        <h3 className="font-semibold mb-4">Up Next</h3>
        <div className="space-y-3">
          {upcomingLessons.map((lesson, index) => (
            <motion.div 
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-neutral flex items-center"
            >
              <div className="bg-neutral-light rounded-lg w-10 h-10 flex items-center justify-center text-neutral-darker mr-3">
                <Play className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">{lesson.title}</h4>
                <p className="text-xs text-neutral-darker">Part {index + 3} of 5 • {formatTime(lesson.duration)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
