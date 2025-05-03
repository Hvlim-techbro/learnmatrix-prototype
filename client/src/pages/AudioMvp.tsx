import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Headphones, MessageSquare, Mic, Settings } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

export default function AudioMvp() {
  const [, setLocation] = useLocation();
  const [interventionHistory, setInterventionHistory] = useState<string[]>([]);
  
  const handleBack = () => {
    setLocation('/audio-tutor');
  };
  
  const handleInterveneComplete = (responseAudioUrl: string) => {
    setInterventionHistory(prev => [...prev, responseAudioUrl]);
  };
  
  return (
    <div className="min-h-screen w-full bg-black p-6 relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-[#1E1E1E] to-transparent opacity-50"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-blue opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 rounded-full bg-gradient-purple opacity-5 blur-3xl"></div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <motion.button 
          className="p-2 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </motion.button>
        
        <h1 className="text-2xl font-bold text-white">Audio Tutor MVP</h1>
        
        <motion.button 
          className="p-2 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="h-6 w-6" />
        </motion.button>
      </div>
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Audio player section */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-blue flex items-center justify-center">
              <Headphones className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Neural Networks Explained</h2>
          </div>
          
          <AudioPlayer onInterveneComplete={handleInterveneComplete} />
        </div>
        
        {/* Intervention history */}
        {interventionHistory.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Your Interventions</h3>
            </div>
            
            <div className="space-y-3">
              {interventionHistory.map((url, index) => (
                <div 
                  key={index}
                  className="bg-[#1E1E1E] rounded-lg p-4 border border-[#333] flex items-center space-x-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center">
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white">Intervention {index + 1}</div>
                    <div className="text-xs text-white/60 truncate max-w-md">{url}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Features explanation */}
        <div className="bg-[#1E1E1E] rounded-xl border border-[#333] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to Use the Audio Tutor</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-blue flex-shrink-0 flex items-center justify-center mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="text-md font-medium text-white">Listen to the lesson</h4>
                <p className="text-sm text-white/60">Play, pause, or seek through the audio lesson using the player controls.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-purple flex-shrink-0 flex items-center justify-center mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="text-md font-medium text-white">Intervene at any time</h4>
                <p className="text-sm text-white/60">Click the microphone button to pause the lesson and ask a question or request clarification.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-green flex-shrink-0 flex items-center justify-center mt-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h4 className="text-md font-medium text-white">Get AI responses</h4>
                <p className="text-sm text-white/60">The AI will respond to your intervention and automatically continue the lesson afterward.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
