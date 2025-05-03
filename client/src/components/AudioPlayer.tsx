import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { motion } from 'framer-motion';
import { Play, Pause, VolumeX, Volume2, SkipForward, SkipBack, Mic, Send, X } from 'lucide-react';

// Default audio URL for testing
const DEFAULT_AUDIO_URL = 'https://file-examples.com/storage/fe9278ad7f642dbd39ac5c9/2017/11/file_example_MP3_700KB.mp3';

type AudioPlayerProps = {
  audioUrl?: string;
  onInterveneComplete?: (responseAudioUrl: string) => void;
};

export default function AudioPlayer({ audioUrl = DEFAULT_AUDIO_URL, onInterveneComplete }: AudioPlayerProps) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Intervention state
  const [isIntervening, setIsIntervening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const recordingRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);
  
  // Sound instance ref
  const soundRef = useRef<Howl | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  
  // Max recording duration in seconds
  const MAX_RECORDING_DURATION = 8;
  
  // Initialize sound
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      preload: true,
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(sound.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        startProgressTimer();
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressTimer();
      },
      onstop: () => {
        setIsPlaying(false);
        stopProgressTimer();
        setCurrentTime(0);
        setProgress(0);
      },
      onend: () => {
        setIsPlaying(false);
        stopProgressTimer();
        setCurrentTime(0);
        setProgress(0);
      }
    });
    
    soundRef.current = sound;
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      stopProgressTimer();
    };
  }, [audioUrl]);
  
  // Start/stop progress timer
  const startProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    
    progressTimerRef.current = window.setInterval(() => {
      if (soundRef.current) {
        const current = soundRef.current.seek();
        setCurrentTime(current);
        setProgress(Math.floor((current / duration) * 100) || 0);
      }
    }, 100) as unknown as number;
  };
  
  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };
  
  // Player controls
  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };
  
  const toggleMute = () => {
    if (!soundRef.current) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    soundRef.current.volume(newMuteState ? 0 : volume);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!soundRef.current) return;
    
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (!isMuted) {
      soundRef.current.volume(value);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!soundRef.current) return;
    
    const value = parseInt(e.target.value, 10);
    const newTime = (value / 100) * duration;
    soundRef.current.seek(newTime);
    setProgress(value);
    setCurrentTime(newTime);
  };
  
  const skip = (direction: 'forward' | 'backward') => {
    if (!soundRef.current) return;
    
    const currentSeek = soundRef.current.seek() as number;
    const skipAmount = 10; // Skip 10 seconds
    
    let newTime = direction === 'forward' ? 
      Math.min(currentSeek + skipAmount, duration) : 
      Math.max(currentSeek - skipAmount, 0);
    
    soundRef.current.seek(newTime);
    setCurrentTime(newTime);
    setProgress(Math.floor((newTime / duration) * 100));
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // WebSocket ref for the audio connection
  const wsRef = useRef<WebSocket | null>(null);
  
  // MediaRecorder ref for recording audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Audio chunks array for storing recorded audio data
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Intervention functionality
  const handleInterveneStart = () => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
    }
    setIsIntervening(true);
  };
  
  const handleCancelIntervene = () => {
    if (isRecording) {
      stopRecording();
    }
    setIsIntervening(false);
    setRecordingTime(0);
    setRecordingProgress(0);
  };
  
  const startRecording = async () => {
    try {
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingProgress(0);
      
      // Set up a timer to track recording time and progress
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 0.1;
          setRecordingProgress((newTime / MAX_RECORDING_DURATION) * 100);
          
          if (newTime >= MAX_RECORDING_DURATION) {
            stopRecording();
            return MAX_RECORDING_DURATION;
          }
          
          return newTime;
        });
      }, 100);
      
      // Auto-stop after MAX_RECORDING_DURATION
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, MAX_RECORDING_DURATION * 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your browser permissions.');
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks in the media stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    setIsRecording(false);
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };
  
  const handleSubmitIntervention = async () => {
    if (audioChunksRef.current.length === 0) {
      alert('No audio recorded. Please record your question first.');
      return;
    }
    
    try {
      // Create a blob from the audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Establish WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/audio`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = async () => {
        console.log('WebSocket connection established');
        
        if (wsRef.current) {
          // Convert blob to array buffer and send over WebSocket
          const arrayBuffer = await audioBlob.arrayBuffer();
          wsRef.current.send(arrayBuffer);
        }
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'transcription') {
            console.log('Transcription received:', data.transcript);
          } 
          else if (data.type === 'ai_response') {
            console.log('AI response received:', data.response);
            
            if (data.audioData) {
              try {
                // Convert base64 audio data to a Blob
                const binaryData = atob(data.audioData);
                const bytes = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                  bytes[i] = binaryData.charCodeAt(i);
                }
                
                // Create blob and URL
                const audioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Create a new Howl instance for the AI response
                const aiSound = new Howl({
                  src: [audioUrl],
                  format: ['mp3'],
                  html5: true,
                  autoplay: false,
                  onend: () => {
                    // Clean up the URL object when done playing
                    URL.revokeObjectURL(audioUrl);
                    
                    // Resume the original audio playback
                    if (soundRef.current) {
                      soundRef.current.play();
                    }
                  },
                  onload: () => {
                    console.log('AI response audio loaded, playing now...');
                    aiSound.play();
                  },
                  onloaderror: (id, error) => {
                    console.error('Error loading AI response audio:', error);
                    // Fall back to text display
                    if (onInterveneComplete) {
                      onInterveneComplete(`AI Response: ${data.response}`);
                    }
                    // Resume original playback
                    if (soundRef.current) {
                      soundRef.current.play();
                    }
                  }
                });
                
                // Store the AI response in intervention history
                if (onInterveneComplete) {
                  onInterveneComplete(`AI Response (audio playing): ${data.response}`);
                }
              } catch (error) {
                console.error('Error processing audio data:', error);
                // Fall back to text display
                if (onInterveneComplete) {
                  onInterveneComplete(`AI Response: ${data.response}`);
                }
                // Resume original playback
                if (soundRef.current) {
                  soundRef.current.play();
                }
              }
            } else {
              // No audio data, just use the text response
              if (onInterveneComplete) {
                onInterveneComplete(`AI Response: ${data.response}`);
              }
              
              // Resume original playback
              if (soundRef.current) {
                soundRef.current.play();
              }
            }
            
            setIsIntervening(false);
            setRecordingTime(0);
            setRecordingProgress(0);
          }
          else if (data.type === 'error') {
            console.error('Error from server:', data.message);
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Error connecting to the server. Please try again.');
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
    } catch (error) {
      console.error('Error submitting intervention:', error);
      alert('Error submitting your question. Please try again.');
      
      setIsIntervening(false);
      setRecordingTime(0);
      setRecordingProgress(0);
    }
  };
  
  // Render different UI based on intervention state
  if (isIntervening) {
    return (
      <motion.div 
        className="bg-[#111] rounded-xl p-6 border border-[#333] shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Ask a Question</h3>
          <motion.button 
            className="text-white/70 hover:text-white p-1 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCancelIntervene}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        <p className="text-[#888] text-sm mb-6">
          {isRecording 
            ? "Recording... Speak clearly into your microphone."
            : "Press the microphone button and ask your question."}
        </p>
        
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Recording progress circle */}
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#333" 
                strokeWidth="8"
              />
              
              {/* Progress circle */}
              {isRecording && (
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#9333EA" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - recordingProgress / 100)}`}
                  transform="rotate(-90 50 50)"
                />
              )}
              
              {/* Microphone button */}
              <foreignObject x="25" y="25" width="50" height="50">
                <motion.button 
                  className={`w-full h-full rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-[#555] hover:bg-[#9333EA]'}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <Mic className="h-6 w-6 text-white" />
                </motion.button>
              </foreignObject>
            </svg>
            
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-mono mt-16">
                  {recordingTime.toFixed(1)}s
                </span>
              </div>
            )}
          </div>
          
          {/* Recording time */}
          <div className="text-center">
            <p className="text-[#888] text-xs">
              {isRecording ? `Max ${MAX_RECORDING_DURATION} seconds` : "Ready to record"}
            </p>
            {recordingTime > 0 && !isRecording && (
              <p className="text-white text-sm mt-2">
                Recorded {recordingTime.toFixed(1)} seconds
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <motion.button 
            className={`px-6 py-3 rounded-lg flex items-center ${recordingTime > 0 ? 'bg-gradient-purple hover:bg-purple-700' : 'bg-[#333] opacity-50 cursor-not-allowed'} text-white font-medium`}
            whileHover={recordingTime > 0 ? { scale: 1.05 } : { scale: 1 }}
            whileTap={recordingTime > 0 ? { scale: 0.95 } : { scale: 1 }}
            onClick={recordingTime > 0 ? handleSubmitIntervention : undefined}
            disabled={recordingTime === 0}
          >
            <Send className="h-4 w-4 mr-2" /> Submit Question
          </motion.button>
        </div>
      </motion.div>
    );
  }
  
  // Regular audio player UI
  return (
    <div className="bg-[#111] rounded-xl p-6 border border-[#333] shadow-lg">
      {/* Progress bar */}
      <div className="mb-4">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress} 
          onChange={handleSeek}
          className="w-full h-2 bg-[#333] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
        />
        <div className="flex justify-between text-xs text-[#888] mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Skip backward */}
          <motion.button 
            className="text-white/70 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => skip('backward')}
          >
            <SkipBack className="h-5 w-5" />
          </motion.button>
          
          {/* Play/Pause */}
          <motion.button 
            className="bg-gradient-blue text-white w-12 h-12 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </motion.button>
          
          {/* Skip forward */}
          <motion.button 
            className="text-white/70 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => skip('forward')}
          >
            <SkipForward className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Intervene button */}
          <motion.button 
            className="bg-gradient-purple text-white px-4 py-2 rounded-full flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInterveneStart}
          >
            <Mic className="h-4 w-4 mr-2" /> Intervene
          </motion.button>
          
          {/* Volume controls */}
          <div className="flex items-center space-x-2">
            <motion.button 
              className="text-white/70 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
