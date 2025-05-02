import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertChallengeSchema, 
  insertBadgeSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket for real-time quiz battles and notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
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
      
      // Check if challenge is complete
      if (updatedChallenge.progress >= updatedChallenge.target) {
        // Award XP
        await storage.updateUserXp(updatedChallenge.userId, updatedChallenge.xpReward);
        
        // Award badge if applicable
        if (updatedChallenge.badgeReward) {
          await storage.createBadge({
            name: updatedChallenge.badgeReward,
            description: `Earned by completing the ${updatedChallenge.title} challenge`,
            icon: 'trophy',
            color: 'accent-yellow',
            userId: updatedChallenge.userId
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
    // In a real app, this would use the session to get the current user
    const user = await storage.getUser(1);
    
    if (!user || !user.cohortId) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    const cohort = await storage.getCohort(user.cohortId);
    
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    res.json(cohort);
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
