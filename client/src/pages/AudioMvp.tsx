import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Headphones, MessageSquare, Mic, Settings, Send, Loader2 } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { Howl } from 'howler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AudioMvp() {
  const [, setLocation] = useLocation();
  const [interventionHistory, setInterventionHistory] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const audioRef = useRef<Howl | null>(null);
  const { toast } = useToast();
  
  const handleBack = () => {
    setLocation('/audio-tutor');
  };
  
  const handleInterveneComplete = (responseAudioUrl: string) => {
    setInterventionHistory(prev => [...prev, responseAudioUrl]);
  };
  
  const generateLesson = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Please enter a topic',
        description: 'Enter a topic to generate a lesson about.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    toast({
      title: 'Generating lesson...',
      description: 'This may take a minute or two.',
    });
    
    try {
      const response = await fetch('/api/audio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate lesson');
      }
      
      const data = await response.json();
      setCurrentTitle(data.title);
      setCurrentAudioUrl(data.audioUrl);
      setShowPlayer(true);
      
      // Create new Howl instance
      if (audioRef.current) {
        audioRef.current.unload();
      }
      
      audioRef.current = new Howl({
        src: [data.audioUrl],
        html5: true,
        autoplay: false,
        onload: () => {
          audioRef.current?.play();
        },
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error);
          toast({
            title: 'Error loading audio',
            description: 'There was a problem loading the audio file.',
            variant: 'destructive'
          });
        }
      });
      
      toast({
        title: 'Lesson generated!',
        description: `Playing lesson on: ${data.title}`,
      });
      
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast({
        title: 'Error generating lesson',
        description: 'There was a problem generating the lesson. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-black p-6 relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-[#121212] to-transparent opacity-50"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-blue opacity-10 blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 rounded-full bg-gradient-purple opacity-10 blur-3xl"></div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <motion.button 
          className="p-2 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </motion.button>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">LearnMatrix</h1>
        
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
        {/* Chat input section */}
        <div className="mb-8">
          <div className="bg-[#121212] rounded-xl border border-[#333] p-4 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Ask me anything...</h2>
            
            <div className="flex gap-2">
              <Input 
                placeholder="What is chemistry?" 
                className="bg-[#1E1E1E] border-[#333] text-white placeholder:text-white/40 h-12"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    generateLesson();
                  }
                }}
                disabled={isLoading}
              />
              <Button 
                onClick={generateLesson} 
                disabled={isLoading} 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white h-12 px-6 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Lesson</>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Audio player section */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-[#121212] rounded-xl border border-[#333] p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/60">Playing lesson on:</div>
                    <h2 className="text-xl font-bold text-white">{currentTitle}</h2>
                  </div>
                </div>
                
                <AudioPlayer 
                  audioUrl={currentAudioUrl} 
                  onInterveneComplete={handleInterveneComplete} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Intervention history */}
        <AnimatePresence>
          {interventionHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-[#121212] rounded-xl border border-[#333] p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Your Interventions</h3>
                </div>
                
                <div className="space-y-3">
                  {interventionHistory.map((url, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="bg-[#1E1E1E] rounded-lg p-4 border border-[#333] flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0 flex items-center justify-center mt-1">
                        <Mic className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white mb-1">Intervention {index + 1}</div>
                        <div className="text-sm text-white/70 break-words">{url}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Features explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-[#121212] rounded-xl border border-[#333] p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6">How to Use the Audio Tutor</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white mb-1">Enter a topic</h4>
                  <p className="text-sm text-white/70">Type any topic you want to learn about and click "Generate Lesson" to create a custom audio lesson.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white mb-1">Listen to the lesson</h4>
                  <p className="text-sm text-white/70">Enjoy your personalized audio tutorial with our dual-host format, featuring clear explanations and engaging examples.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-md font-bold text-white mb-1">Intervene anytime</h4>
                  <p className="text-sm text-white/70">Click the microphone button to pause the lesson and ask a question. The AI will respond and continue the lesson.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
