import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import OpenAI from "openai";
import fs from 'fs';
import path from 'path';
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertChallengeSchema, 
  insertBadgeSchema 
} from "@shared/schema";

// Initialize OpenAI clients with API keys from environment (with fallbacks)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Separate client for TTS operations
const ttsOpenai = process.env.TTS_OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.TTS_OPENAI_API_KEY }) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up static file serving for generated audio files
  app.use('/public', express.static(path.join(process.cwd(), 'public')));
  
  // WebSocket for real-time quiz battles and notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // WebSocket server for audio transcription
  const audioWss = new WebSocketServer({ server: httpServer, path: '/ws/audio' });
  console.log('Audio WebSocket server initialized on path: /ws/audio');
  
  audioWss.on('connection', (ws) => {
    console.log('Audio WebSocket connection established');
    
    ws.on('message', async (message) => {
      try {
        // Check if the message is binary (audio data)
        if (message instanceof Buffer) {
          console.log('Received audio data, length:', message.length);
          
          try {
            // Create a unique filename to avoid conflicts
            const timestamp = Date.now();
            const tempFilePath = path.join(process.cwd(), `temp_audio_${timestamp}.webm`);
            console.log('Saving audio to:', tempFilePath);
            
            // Save the audio buffer to a temporary file
            fs.writeFileSync(tempFilePath, Buffer.from(message));
            
            console.log('Audio file saved, starting transcription...');
            
            let transcriptionText = '';
            let responseText = '';
            
            if (!openai) {
              console.log('OpenAI API key not available, using mock transcription');
              transcriptionText = 'Mock transcription: Can you explain neural networks?';
              
              // Clean up temporary audio file
              fs.unlinkSync(tempFilePath);
              
              // Send the mock transcription back to the client
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'transcription',
                  transcript: transcriptionText
                }));
              }
              
              // Step 2: Generate mock AI response
              const moduleName = "Neural Networks and Deep Learning";
              responseText = `Host A: Great question about neural networks! Neural networks are computational models inspired by the human brain.

Host B: That's right, Host A! Think of them like a network of interconnected nodes, similar to how neurons connect in our brains. They're fantastic for pattern recognition and learning from data.

Host A: Exactly, Host B. Each connection has a weight that gets adjusted during training, allowing the network to learn and make predictions on new data.`;
              
            } else {
              // Step 1: Transcribe audio with Whisper
              const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: 'whisper-1',
              });
              
              transcriptionText = transcription.text;
              console.log('Transcription successful:', transcriptionText);
              
              // Clean up temporary audio file
              fs.unlinkSync(tempFilePath);
              
              // Send the transcription back to the client
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'transcription',
                  transcript: transcriptionText
                }));
              }
              
              // Step 2: Get AI response from GPT-4o with host personas
              const moduleName = "Neural Networks and Deep Learning";
              
              const gptResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                  {
                    role: "system",
                    content: "You are two co-hosts on an educational podcast discussing a topic in depth. Host A is clear and concise; Host B is friendly and humorous. Always refer back to each other by name ('Host A: …', 'Host B: …')."
                  },
                  {
                    role: "user",
                    content: `Module: ${moduleName}\nLearner asked: ${transcriptionText}\nContinue the discussion.`
                  }
                ],
                max_tokens: 300
              });
              
              responseText = gptResponse.choices[0].message.content || '';
            }
            
            console.log('AI response:', responseText);
            
            // Step 3: Convert response to speech with OpenAI TTS (if available)
            try {
              if (!ttsOpenai) {
                console.log('TTS OpenAI API key not available, sending text-only response');
                // Send text-only response
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'ai_response',
                    response: responseText
                  }));
                }
              } else {
                // Ensure we have valid text for TTS
                const ttsInput = responseText.trim() || 'I apologize, but I need more information to provide a helpful response.';
                
                // Use the dedicated TTS OpenAI client
                const audioResponse = await ttsOpenai.audio.speech.create({
                  model: "tts-1",
                  voice: "alloy",
                  input: ttsInput,
                });
                
                // Get audio data as buffer
                const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
                
                // Save to a temporary file
                const tempAudioPath = path.join(process.cwd(), `temp_response_${Date.now()}.mp3`);
                fs.writeFileSync(tempAudioPath, audioBuffer);
                
                // Convert to base64 for sending over WebSocket
                const audioBase64 = fs.readFileSync(tempAudioPath).toString('base64');
                
                // Send both text and audio data back to the client
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                    type: 'ai_response',
                    response: responseText,
                    audioData: audioBase64
                  }));
                }
                
                // Clean up the temporary file
                fs.unlinkSync(tempAudioPath);
              }
              
            } catch (ttsError) {
              console.error('Error generating TTS:', ttsError);
              
              // Fallback to just sending the text response if TTS fails
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'ai_response',
                  response: responseText
                }));
              }
            }
            
          } catch (processingError) {
            console.error('Error processing audio:', processingError);
            
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Error processing audio'
              }));
            }
          }
          
        } else {
          console.log('Received non-binary message:', message.toString());
          
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Expected binary audio data'
            }));
          }
        }
        
      } catch (error) {
        console.error('WebSocket error:', error);
        
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Server error processing request'
            }));
          }
        } catch (sendError) {
          console.error('Error sending error message:', sendError);
        }
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
    });
    
    ws.on('close', () => {
      console.log('Audio WebSocket connection closed');
    });
  });
  
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      
      // Broadcasting quiz battle invites or updates
      if (data.type === 'quiz_invite' || data.type === 'quiz_update') {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    });
    
    // Send initial connection message
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to LearnMatrix' }));
  });
  
  // === API Routes ===
  
  // Generate audio lesson from topic
  app.post('/api/audio/chat', async (req, res) => {
    try {
      // Get topic from request body
      const { topic } = req.body;
      
      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: 'Topic is required and must be a string' });
      }
      
      console.log('Generating audio lesson for topic:', topic);
      
      // Mock data for fallback if needed
      const mockLesson: {
        title: string;
        audioUrl: string | null;
        transcript: string | null;
        error?: string;
      } = {
        title: topic,
        audioUrl: null,
        transcript: null
      };
      
      let responseText = '';
      
      if (!openai) {
        console.log('OpenAI API key not available, using mock content');
        responseText = `Host A: Welcome to our educational podcast! Today, we'll be discussing ${topic}.

Host B: That's right, Host A! This is a fascinating subject that many people are curious about.

Host A: For starters, let's define what ${topic} means in simple terms. It's a subject that involves understanding the world around us.

Host B: Exactly! And you know what I find interesting? How this topic connects to our everyday lives in ways we might not even realize.

Host A: Let's break down some key concepts that our listeners should know about ${topic}.

Host B: And I'll throw in some fun examples to make these concepts more relatable!

Host A: The fundamentals of ${topic} can be quite complex, but when we break them down step by step, they become much more manageable.

Host B: That's the beauty of learning - taking something that seems overwhelming and making it digestible!`;
        
        console.log('Generated mock content successfully');
      } else {
        try {
          // Generate content using GPT-4o
          const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are two co-hosts on an educational podcast discussing a topic in depth. Host A is clear, concise, and provides factual explanations; Host B is friendly, humorous, and adds relatable examples. Always refer back to each other by name ('Host A: …', 'Host B: …')."
              },
              {
                role: "user",
                content: `Module Topic: ${topic}\nCreate a 2-3 minute dialogue as Host A and Host B explaining this topic in an engaging and educational manner. Start by introducing the topic.`
              }
            ],
            max_tokens: 800,
            temperature: 0.7
          });
          
          // Extract the content from the response
          responseText = gptResponse.choices[0].message.content || 'I apologize, but I could not generate content for this topic.';
          console.log('Generated text content successfully');
        } catch (gptError: any) {
          console.error('Error with GPT response:', gptError);
          // Use fallback content
          responseText = `Host A: Welcome to our educational podcast! Today, we'll be discussing ${topic}.

Host B: That's right! This is a fascinating subject that many people are curious about.

Host A: For starters, let's define what ${topic} means in simple terms. It's a subject that involves understanding the world around us.

Host B: Exactly! And you know what I find interesting? How this topic connects to our everyday lives in ways we might not even realize.

Host A: Let's break down some key concepts that our listeners should know about ${topic}.

Host B: And I'll throw in some fun examples to make these concepts more relatable!`;
        }
      }
      
      // Update mock data with the transcript
      mockLesson.transcript = responseText;
        
        // Generate speech audio from the text using TTS API (if available)
        try {
          if (!ttsOpenai) {
            console.log('TTS OpenAI API key not available, returning text-only lesson');
            return res.json({
              title: topic,
              transcript: responseText,
              audioUrl: null,
              error: "TTS not available without API key"
            });
          }
          
          const audioResponse = await ttsOpenai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: responseText,
          });
          
          // Convert audio to buffer
          const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
          
          // Create a unique filename
          const audioFilename = `lesson_${Date.now()}.mp3`;
          const audioPath = path.join(process.cwd(), 'public', audioFilename);
          
          // Ensure the public directory exists
          if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
            fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
          }
          
          // Save audio to file
          fs.writeFileSync(audioPath, audioBuffer);
          
          // Create a URL for the audio file
          const audioUrl = `/public/${audioFilename}`;
          mockLesson.audioUrl = audioUrl;
          
          console.log('Audio generation successful:', audioUrl);
          
          // Return the complete lesson data
          return res.json({
            title: topic,
            audioUrl,
            transcript: responseText
          });
          
        } catch (ttsError: any) {
          console.error('Error generating TTS:', ttsError);
          // Continue with text-only fallback
          if (typeof ttsError === 'object' && ttsError?.message && ttsError.message.includes('quota')) {
            console.log('TTS quota exceeded, falling back to text-only');
            return res.json({
              title: topic,
              transcript: responseText,
              audioUrl: null,
              error: "TTS quota exceeded, text-only response provided"
            });
          } else {
            throw ttsError;
          }
        }
        
      } catch (gptError: any) {
          console.error('Error with GPT response:', gptError);
          
          // Provide fallback for rate limiting errors
          if (typeof gptError === 'object' && gptError?.message && gptError.message.includes('quota')) {
            console.log('GPT quota exceeded, using fallback content');
            
            // Define a fallback lesson script on the topic
            const fallbackText = `Host A: Welcome to our educational podcast! Today, we'll be discussing ${topic}.

Host B: That's right! This is a fascinating subject that many people are curious about.

Host A: For starters, let's define what ${topic} means in simple terms. It's a subject that involves understanding the world around us.

Host B: Exactly! And you know what I find interesting? How this topic connects to our everyday lives in ways we might not even realize.

Host A: Let's break down some key concepts that our listeners should know about ${topic}.

Host B: And I'll throw in some fun examples to make these concepts more relatable!`;
            
            mockLesson.transcript = fallbackText;
            
            return res.json({
              title: topic,
              transcript: fallbackText,
              audioUrl: null,
              error: "API quota exceeded, text-only fallback provided"
            });
          } else {
            // For other errors, rethrow
            throw gptError;
          }
        }
        
      } catch (error: any) {
      console.error('Error generating audio lesson:', error);
      
      // Provide a detailed error message based on the type of error
      const errorMessage = typeof error === 'object' && error?.message ? error.message : 'Internal server error';
      const statusCode = typeof error === 'object' && error?.status ? error.status : 500;
      
      return res.status(statusCode).json({ 
        error: errorMessage,
        details: typeof error === 'object' && error?.code ? error.code : 'unknown_error'
      });
    }
  });
  
  // Get current user
  app.get('/api/user', async (req, res) => {
    // In a real app, this would use the session to get the current user
    // For simplicity, we'll return a mock user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't expose password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Get modules
  app.get('/api/modules', async (req, res) => {
    const modules = await storage.getModules();
    res.json(modules);
  });
  
  // Get lessons for a specific module
  app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    const moduleId = parseInt(req.params.moduleId);
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: 'Invalid module ID' });
    }
    
    const lessons = await storage.getLessons(moduleId);
    res.json(lessons);
  });
  
  // Get daily challenges
  app.get('/api/challenges/daily', async (req, res) => {
    const challenges = await storage.getChallenges('daily');
    res.json(challenges);
  });
  
  // Update challenge progress
  app.post('/api/challenges/:id/progress', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid challenge ID' });
    }
    
    const schema = z.object({
      progress: z.number().min(0),
    });
    
    try {
      const { progress } = schema.parse(req.body);
      const updatedChallenge = await storage.updateChallengeProgress(id, progress);
      
      if (!updatedChallenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      
      // Get XP reward amount from the challenge data or use default value
      const xpToAward = Number(updatedChallenge.xpReward || 10); // Convert to number
      
      // Check if challenge is complete
      if (updatedChallenge.progress >= updatedChallenge.target) {
        // Award XP to the user
        const userId = Number(updatedChallenge.userId || 1); // Ensure userId is a number
        await storage.updateUserXp(userId, xpToAward);
        
        // Award badge if applicable
        if (updatedChallenge.badgeReward) {
          await storage.createBadge({
            name: updatedChallenge.badgeReward,
            description: `Earned by completing the ${updatedChallenge.title} challenge`,
            icon: 'trophy',
            color: 'accent-yellow',
            userId: Number(updatedChallenge.userId || 1) // Ensure we use a valid number
          });
        }
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request' });
    }
  });
  
  // Get user badges
  app.get('/api/user/badges', async (req, res) => {
    // In a real app, this would use the session to get the current user
    const userId = 1;
    const badges = await storage.getBadges(userId);
    res.json(badges);
  });
  
  // Get user's cohort
  app.get('/api/user/cohort', async (req, res) => {
    try {
      // In a real app, this would use the session to get the current user
      const user = await storage.getUser(1);
      
      if (!user || !user.cohortId) {
        // Return a default cohort instead of 404
        const defaultCohort = {
          id: 1,
          name: 'Scholar Circle Alpha',
          description: 'Elite learning group for ambitious students',
          memberCount: 12
        };
        return res.json(defaultCohort);
      }
      
      const cohort = await storage.getCohort(user.cohortId);
      
      if (!cohort) {
        const defaultCohort = {
          id: 1,
          name: 'Scholar Circle Alpha', 
          description: 'Elite learning group for ambitious students',
          memberCount: 12
        };
        return res.json(defaultCohort);
      }
      
      res.json(cohort);
    } catch (error) {
      console.error('Error fetching cohort:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Mark lesson as completed
  app.post('/api/lessons/:id/complete', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }
    
    // In a real app, this would use the session to get the current user
    const userId = 1;
    
    const updatedLesson = await storage.markLessonCompleted(id, userId);
    
    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Award XP for completing lesson
    await storage.updateUserXp(userId, 20);
    
    res.json(updatedLesson);
  });

  return httpServer;
}
