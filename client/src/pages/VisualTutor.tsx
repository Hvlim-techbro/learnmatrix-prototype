import { useState } from 'react';
import { Play, Rewind, FastForward, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisualTutor() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const concepts = [
    { name: 'Activation Functions', selected: false },
    { name: 'Backpropagation', selected: false },
    { name: 'Gradient Descent', selected: false },
  ];
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">AI Visual Tutor</h2>
        <p className="text-neutral-darker">Learn with interactive visualizations</p>
      </div>
      
      {/* Whiteboard Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-neutral mb-6 overflow-hidden"
      >
        <div className="p-4 border-b border-neutral">
          <h3 className="font-semibold">Neural Network Architecture</h3>
        </div>
        <div className="h-64 bg-white p-2 flex items-center justify-center">
          {/* Placeholder for whiteboard animation */}
          <div className="text-center text-neutral-dark">
            <ChalkBoard className="h-12 w-12 mb-3 mx-auto" />
            <p>Interactive whiteboard will appear here</p>
          </div>
        </div>
      </motion.div>
      
      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-neutral mb-6"
      >
        <div className="flex justify-between">
          <button className="bg-neutral text-neutral-darker rounded-full px-4 py-2 text-sm flex items-center">
            <Rewind className="h-4 w-4 mr-1" /> Rewind
          </button>
          <button 
            className="bg-primary text-white rounded-full px-4 py-2 text-sm flex items-center"
            onClick={handlePlayPause}
          >
            <Play className="h-4 w-4 mr-1" /> {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button className="bg-neutral text-neutral-darker rounded-full px-4 py-2 text-sm flex items-center">
            <FastForward className="h-4 w-4 mr-1" /> Skip
          </button>
        </div>
      </motion.div>
      
      {/* Concept Highlights */}
      <div>
        <h3 className="font-semibold mb-4">Highlight Key Concepts</h3>
        <div className="space-y-3">
          {concepts.map((concept, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-neutral"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-accent-purple mr-3">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{concept.name}</span>
                </div>
                <button className="text-primary">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChalkBoard() {
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
      <rect width="18" height="12" x="3" y="4" rx="2" />
      <line x1="2" x2="22" y1="20" y2="20" />
    </svg>
  );
}

function Lightbulb() {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
