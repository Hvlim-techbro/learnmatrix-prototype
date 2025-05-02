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
    <div className="p-6 bg-black min-h-[calc(100vh-8rem)]">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-white">AI Visual Tutor</h2>
        <p className="text-[#888]">Learn with interactive visualizations</p>
      </motion.div>
      
      {/* Whiteboard Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] rounded-xl shadow-md border border-[#333] mb-6 overflow-hidden"
        whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      >
        <div className="p-4 border-b border-[#333] flex justify-between items-center">
          <h3 className="font-semibold text-white">Neural Network Architecture</h3>
          <div className="flex space-x-2">
            {['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map((color, index) => (
              <motion.div 
                key={index}
                className="w-4 h-4 rounded-full cursor-pointer"
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
        <div className="h-72 bg-[#0a0a0a] p-2 flex items-center justify-center relative">
          {/* Neural Network Visualization */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <svg width="300" height="200" viewBox="0 0 300 200">
              {/* Input layer */}
              {[40, 80, 120, 160].map((y, i) => (
                <g key={`input-${i}`}>
                  <motion.circle 
                    cx="60" 
                    cy={y} 
                    r="10" 
                    fill="#3b82f6" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  />
                </g>
              ))}
              
              {/* Hidden layer */}
              {[40, 80, 120, 160].map((y, i) => (
                <g key={`hidden-${i}`}>
                  <motion.circle 
                    cx="150" 
                    cy={y} 
                    r="10" 
                    fill="#8b5cf6" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: 0.5 + i * 0.2, repeat: Infinity }}
                  />
                </g>
              ))}
              
              {/* Output layer */}
              {[80, 120].map((y, i) => (
                <g key={`output-${i}`}>
                  <motion.circle 
                    cx="240" 
                    cy={y} 
                    r="10" 
                    fill="#ec4899" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: 1 + i * 0.2, repeat: Infinity }}
                  />
                </g>
              ))}
              
              {/* Connections */}
              {[40, 80, 120, 160].map((inputY) => 
                [40, 80, 120, 160].map((hiddenY, hi) => (
                  <motion.line 
                    key={`conn-in-${inputY}-${hiddenY}`}
                    x1="70" 
                    y1={inputY} 
                    x2="140" 
                    y2={hiddenY} 
                    stroke="#333"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0.2 }}
                    animate={isPlaying ? { 
                      pathLength: [0, 1],
                      opacity: [0.2, 0.6, 0.2]
                    } : { pathLength: 0.5, opacity: 0.2 }}
                    transition={{ 
                      duration: 2, 
                      delay: (hi * 0.1), 
                      repeat: isPlaying ? Infinity : 0,
                      repeatType: 'loop'
                    }}
                  />
                ))
              )}
              
              {[40, 80, 120, 160].map((hiddenY) => 
                [80, 120].map((outputY, oi) => (
                  <motion.line 
                    key={`conn-out-${hiddenY}-${outputY}`}
                    x1="160" 
                    y1={hiddenY} 
                    x2="230" 
                    y2={outputY} 
                    stroke="#333"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0.2 }}
                    animate={isPlaying ? { 
                      pathLength: [0, 1],
                      opacity: [0.2, 0.6, 0.2]
                    } : { pathLength: 0.5, opacity: 0.2 }}
                    transition={{ 
                      duration: 2, 
                      delay: 0.5 + (oi * 0.1), 
                      repeat: isPlaying ? Infinity : 0,
                      repeatType: 'loop'
                    }}
                  />
                ))
              )}
            </svg>
          </div>
          
          {/* Text Overlay */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center text-white px-6 py-4 rounded-lg bg-black/50 backdrop-blur-sm">
              <motion.div 
                className="flex items-center justify-center text-primary mb-3"
                animate={isPlaying ? {
                  scale: [1, 1.1, 1], 
                  rotate: [0, 5, 0, -5, 0]
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ChalkBoard className="h-8 w-8" />
              </motion.div>
              <p className="text-white font-medium mb-1">Interactive Whiteboard</p>
              <p className="text-[#888] text-sm">Click Play to start the animation</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-[#111] rounded-xl p-5 shadow-md border border-[#222] mb-6"
      >
        <div className="flex justify-between">
          <motion.button 
            className="bg-[#222] text-[#888] rounded-full px-5 py-2.5 text-sm flex items-center transition-colors"
            whileHover={{ backgroundColor: '#333', color: '#fff' }}
            whileTap={{ scale: 0.95 }}
          >
            <Rewind className="h-4 w-4 mr-2" /> Rewind
          </motion.button>
          <motion.button 
            className="bg-gradient-purple text-white rounded-full px-5 py-2.5 text-sm flex items-center shadow-lg"
            onClick={handlePlayPause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isPlaying ? {
              boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 15px rgba(139,92,246,0.5)', '0 0 0 rgba(139,92,246,0)'],
            } : {}}
            transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
          >
            <Play className="h-4 w-4 mr-2" /> {isPlaying ? 'Pause' : 'Play'}
          </motion.button>
          <motion.button 
            className="bg-[#222] text-[#888] rounded-full px-5 py-2.5 text-sm flex items-center transition-colors"
            whileHover={{ backgroundColor: '#333', color: '#fff' }}
            whileTap={{ scale: 0.95 }}
          >
            <FastForward className="h-4 w-4 mr-2" /> Skip
          </motion.button>
        </div>
      </motion.div>
      
      {/* Concept Highlights */}
      <div>
        <h3 className="font-semibold mb-4 text-white">Highlight Key Concepts</h3>
        <div className="space-y-3">
          {concepts.map((concept, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="bg-[#111] rounded-xl p-4 shadow-md border border-[#222]"
              whileHover={{ y: -5, borderColor: '#333', backgroundColor: '#161616' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <motion.div 
                    className="text-purple-400 mr-3"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  >
                    <Lightbulb className="h-5 w-5" />
                  </motion.div>
                  <span className="font-medium text-white">{concept.name}</span>
                </div>
                <motion.button 
                  className="text-purple-400 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
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
