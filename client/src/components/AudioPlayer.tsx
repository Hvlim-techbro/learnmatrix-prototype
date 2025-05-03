import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, SkipBack, SkipForward, Mic, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

type AudioPlayerProps = {
  audioUrl?: string;
  onInterveneComplete?: (responseAudioUrl: string) => void;
};

const DEFAULT_AUDIO_URL = 'https://s3.amazonaws.com/cdn01.ituneweekly.com/1990-podcast-demo.mp3';

export default function AudioPlayer({ audioUrl = DEFAULT_AUDIO_URL, onInterveneComplete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [seek, setSeek] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  const soundRef = useRef<Howl | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const seekIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Set up Howler instance
  useEffect(() => {
    // Cleanup previous sound instance
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    // Create new sound instance
    soundRef.current = new Howl({
      src: [audioUrl],
      html5: true,
      volume: volume,
      onload: () => {
        setIsLoading(false);
        setDuration(soundRef.current?.duration() || 0);
      },
      onplay: () => {
        setIsPlaying(true);
        startSeekInterval();
      },
      onpause: () => {
        setIsPlaying(false);
        clearSeekInterval();
      },
      onstop: () => {
        setIsPlaying(false);
        setSeek(0);
        clearSeekInterval();
      },
      onend: () => {
        setIsPlaying(false);
        setSeek(0);
        clearSeekInterval();
      },
      onseek: () => {
        setSeek(soundRef.current?.seek() || 0);
      },
    });
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearSeekInterval();
    };
  }, [audioUrl]);
  
  // Update volume when it changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);
  
  // Handle timer for recording countdown
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 8000) {
            stopRecording();
            return 0;
          }
          return prev + 100;
        });
      }, 100);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);
  
  const startSeekInterval = () => {
    clearSeekInterval();
    seekIntervalRef.current = setInterval(() => {
      if (soundRef.current) {
        setSeek(soundRef.current.seek());
      }
    }, 1000);
  };
  
  const clearSeekInterval = () => {
    if (seekIntervalRef.current) {
      clearInterval(seekIntervalRef.current);
      seekIntervalRef.current = null;
    }
  };
  
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs - minutes * 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handlePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };
  
  const handleStop = () => {
    if (!soundRef.current) return;
    soundRef.current.stop();
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSeek(value);
    if (soundRef.current) {
      soundRef.current.seek(value);
    }
  };
  
  const jumpForward = () => {
    if (!soundRef.current) return;
    const currentSeek = soundRef.current.seek();
    const newSeek = Math.min(currentSeek + 10, soundRef.current.duration());
    soundRef.current.seek(newSeek);
    setSeek(newSeek);
  };
  
  const jumpBackward = () => {
    if (!soundRef.current) return;
    const currentSeek = soundRef.current.seek();
    const newSeek = Math.max(currentSeek - 10, 0);
    soundRef.current.seek(newSeek);
    setSeek(newSeek);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  // Intervene functionality
  const startRecording = async () => {
    if (isRecording) return;
    
    // Pause current playback
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        processRecording();
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Recording started",
        description: "Speak now. Recording will automatically stop after 8 seconds.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      toast({
        title: "Recording error",
        description: "No audio data was captured.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create WebSocket connection
      const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/audio`);
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket connection opened');
        socket.send(audioBlob);
        
        toast({
          title: "Processing",
          description: "Your audio is being processed...",
        });
      };
      
      socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.audioUrl) {
            // For MVP, we'll just simulate receiving a response
            handleInterventionResponse(response.audioUrl);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection error",
          description: "Failed to process your audio. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
      
      // For MVP purposes, let's simulate a response after 2 seconds
      setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
          // Simulate a response coming from the server
          const mockResponseUrl = 'https://s3.amazonaws.com/cdn01.ituneweekly.com/demo-response.mp3';
          handleInterventionResponse(mockResponseUrl);
          socket.close();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error processing recording:', error);
      toast({
        title: "Processing error",
        description: "Failed to process your audio. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  const handleInterventionResponse = (responseAudioUrl: string) => {
    setIsProcessing(false);
    
    toast({
      title: "Response received",
      description: "Playing AI response...",
    });
    
    // Create a new Howl instance for the response audio
    const responseSound = new Howl({
      src: [responseAudioUrl],
      html5: true,
      volume: volume,
      onend: () => {
        // Resume original audio after response is done
        if (soundRef.current) {
          soundRef.current.play();
        }
      }
    });
    
    // Play the response
    responseSound.play();
    
    // Call the callback if provided
    if (onInterveneComplete) {
      onInterveneComplete(responseAudioUrl);
    }
  };
  
  return (
    <div className="bg-[#1E1E1E] rounded-xl border border-[#333] p-6 shadow-md w-full max-w-md mx-auto relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-blue opacity-10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-xl"></div>
      
      {/* Waveform / Timeline display */}
      <div className="relative w-full h-20 bg-[#111] rounded-lg mb-4 overflow-hidden flex flex-col justify-center">
        {/* Simplified waveform graphic */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const height = 5 + Math.random() * 25;
            return (
              <div 
                key={i} 
                className="w-1.5 mx-0.5 bg-gradient-to-t from-[#29B6F6]/30 to-[#29B6F6]/80 rounded-full" 
                style={{ 
                  height: `${height}px`,
                  opacity: seek > 0 && i < (seek / duration) * 40 ? 1 : 0.4
                }}
              />
            );
          })}
        </div>
        
        {/* Seek control */}
        <input 
          type="range" 
          min="0" 
          max={duration} 
          step="0.01" 
          value={seek} 
          onChange={handleSeek}
          className="w-full absolute bottom-0 left-0 right-0 accent-[#29B6F6] appearance-none bg-transparent z-10 cursor-pointer" 
          disabled={isLoading}
        />
        
        {/* Time display */}
        <div className="absolute bottom-1 left-2 text-xs text-white/60">
          {formatTime(seek)}
        </div>
        <div className="absolute bottom-1 right-2 text-xs text-white/60">
          {formatTime(duration)}
        </div>
        
        {/* Intervene Button */}
        <motion.button
          className="absolute right-3 top-3 z-20 bg-gradient-red rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : isRecording ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </motion.button>
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute left-3 top-3 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-white">
              {(8 - recordingTime / 1000).toFixed(1)}s
            </span>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#333] hover:bg-[#444] border-none h-12 w-12 rounded-full"
            onClick={jumpBackward}
            disabled={isLoading}
          >
            <SkipBack className="h-5 w-5 text-white" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#29B6F6] hover:bg-[#29B6F6]/90 border-none h-14 w-14 rounded-full"
            onClick={handlePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-1" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#333] hover:bg-[#444] border-none h-12 w-12 rounded-full"
            onClick={jumpForward}
            disabled={isLoading}
          >
            <SkipForward className="h-5 w-5 text-white" />
          </Button>
        </div>
        
        <div className="w-1/3 flex items-center space-x-2">
          <span className="text-xs text-white/60">Vol</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-full accent-[#29B6F6] appearance-none h-1 bg-[#333] rounded-full" 
          />
        </div>
      </div>
      
      {/* Description text */}
      <div className="mt-4 text-center text-sm text-white/60">
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing your intervention...</span>
          </div>
        ) : isRecording ? (
          <div>Recording your intervention. Speak now!</div>
        ) : (
          <div>Press the mic button to intervene and ask questions.</div>
        )}
      </div>
    </div>
  );
}
