import { 
  users, type User, type InsertUser,
  cohorts, type Cohort, type InsertCohort,
  challenges, type Challenge, type InsertChallenge,
  badges, type Badge, type InsertBadge,
  modules, type Module, type InsertModule,
  lessons, type Lesson, type InsertLesson
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserXp(id: number, xp: number): Promise<User | undefined>;
  getUserChallenges(userId: number): Promise<Challenge[]>;
  
  // Cohort operations
  getCohort(id: number): Promise<Cohort | undefined>;
  createCohort(cohort: InsertCohort): Promise<Cohort>;
  addUserToCohort(userId: number, cohortId: number): Promise<void>;
  
  // Challenge operations
  getChallenges(type: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallengeProgress(id: number, progress: number): Promise<Challenge | undefined>;
  
  // Badge operations
  getBadges(userId: number): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // Module operations
  getModules(): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Lesson operations
  getLessons(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  markLessonCompleted(id: number, userId: number): Promise<Lesson | undefined>;
}

import { db } from './db';
import { eq, and } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with default data
    this.initDefaultData().catch(console.error);
  }
  
  private async initDefaultData() {
    try {
      // Check if we already have users in the database
      const userCheck = await db.select().from(users).limit(1);
      if (userCheck.length > 0) {
        console.log('Database already initialized with data');
        return;
      }
      
      console.log('Initializing database with default data...');
    } catch (error) {
      console.warn('Database connection issue, using memory storage fallback');
      return;
    }
    
    // Create default user
    const defaultUser = await this.createUser({
      username: "jordan",
      password: "password123", // In a real app, this would be hashed
      displayName: "Jordan Lee",
      avatarInitials: "JL",
      avatarColor: "accent-blue"
    });
    
    // Create modules
    const moduleData: InsertModule[] = [
      { name: "AI Audio Tutor", description: "Learn with podcast-style lessons", icon: "microphone-alt", color: "accent-blue" },
      { name: "AI Visual Tutor", description: "Interactive whiteboard learning", icon: "chalkboard-teacher", color: "accent-purple" },
      { name: "Quiz Battle Arena", description: "Test your knowledge against others", icon: "trophy", color: "secondary" },
      { name: "Cohort Engine", description: "Learn together with peers", icon: "users", color: "accent-green" },
      { name: "Curriculum Composer", description: "Personalized learning paths", icon: "book-open", color: "accent-yellow" },
      { name: "BEYOND", description: "Advanced research tools", icon: "rocket", color: "primary" },
    ];
    
    const createdModules = await Promise.all(moduleData.map(mod => this.createModule(mod)));
    
    // Create default cohort
    const defaultCohort = await this.createCohort({
      name: "AI Enthusiasts",
      description: "A group of learners focused on artificial intelligence and machine learning",
      tier: "Scholar Circle"
    });
    
    // Add user to cohort
    await this.addUserToCohort(defaultUser.id, defaultCohort.id);
    
    // Create some default challenges
    const challenge1 = await this.createChallenge({
      title: "Complete 1 quiz battle",
      description: "Win a battle in the Quiz Arena",
      type: "daily",
      xpReward: 15,
      target: 1,
      userId: defaultUser.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    // Create challenge with initial progress
    const highlightChallenge = await this.createChallenge({
      title: "Highlight a concept in Visual Tutor",
      description: "Find and highlight key concepts",
      type: "daily",
      xpReward: 10,
      target: 3,
      userId: defaultUser.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    // Update progress for this challenge
    await this.updateChallengeProgress(highlightChallenge.id, 2);
    
    // Create some badges for user
    await this.createBadge({
      name: "Streak Keeper",
      description: "7-day learning streak",
      icon: "fire",
      color: "accent-yellow",
      userId: defaultUser.id
    });
    
    await this.createBadge({
      name: "Fast Learner",
      description: "Top 5% of cohort in lesson completion speed",
      icon: "zap",
      color: "accent-blue",
      userId: defaultUser.id
    });
    
    // Create lessons for audio tutor
    const audioTutorLessons = [
      { title: "Introduction to Neural Networks", moduleId: createdModules[0].id, duration: 765, userId: defaultUser.id },
      { title: "Training Neural Networks", moduleId: createdModules[0].id, duration: 930, userId: defaultUser.id },
      { title: "Applications of Neural Networks", moduleId: createdModules[0].id, duration: 1100, userId: defaultUser.id },
      { title: "Advanced Neural Network Architectures", moduleId: createdModules[0].id, duration: 1215, userId: defaultUser.id }
    ];
    
    const createdLessons = await Promise.all(audioTutorLessons.map(lesson => this.createLesson(lesson)));
    
    // Mark first lesson as completed
    await this.markLessonCompleted(createdLessons[0].id, defaultUser.id);
    
    // Update user XP to have some initial progress
    await this.updateUserXp(defaultUser.id, 250);
    
    console.log('Database successfully initialized with default data');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName,
      avatarInitials: insertUser.avatarInitials || "",
      avatarColor: insertUser.avatarColor || "primary",
      xp: 0,
      level: 1,
      tier: "Novice Nexus",
      streak: 0,
      lastActive: new Date()
    }).returning();
    return user;
  }
  
  async updateUserXp(id: number, xp: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const newXp = user.xp + xp;
    const newLevel = Math.floor(newXp / 300) + 1;
    
    const [updatedUser] = await db
      .update(users)
      .set({ xp: newXp, level: newLevel })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  async getUserChallenges(userId: number): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .where(eq(challenges.userId, userId));
  }

  // Cohort operations
  async getCohort(id: number): Promise<Cohort | undefined> {
    const [cohort] = await db.select().from(cohorts).where(eq(cohorts.id, id));
    return cohort;
  }

  async createCohort(insertCohort: InsertCohort): Promise<Cohort> {
    const [cohort] = await db.insert(cohorts).values({
      name: insertCohort.name,
      description: insertCohort.description,
      tier: insertCohort.tier || "Novice Nexus",
      memberCount: 0
    }).returning();
    return cohort;
  }
  
  async addUserToCohort(userId: number, cohortId: number): Promise<void> {
    const user = await this.getUser(userId);
    const cohort = await this.getCohort(cohortId);
    
    if (!user || !cohort) return;
    
    // Update user with cohort ID
    await db
      .update(users)
      .set({ cohortId })
      .where(eq(users.id, userId));
    
    // Update cohort member count
    await db
      .update(cohorts)
      .set({ memberCount: cohort.memberCount + 1 })
      .where(eq(cohorts.id, cohortId));
  }

  // Challenge operations
  async getChallenges(type: string): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .where(eq(challenges.type, type));
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const [challenge] = await db.insert(challenges).values({
      title: insertChallenge.title,
      description: insertChallenge.description,
      type: insertChallenge.type,
      xpReward: insertChallenge.xpReward,
      badgeReward: insertChallenge.badgeReward || null,
      target: insertChallenge.target,
      progress: 0,
      userId: insertChallenge.userId || null,
      expiresAt: insertChallenge.expiresAt || null
    }).returning();
    return challenge;
  }
  
  async updateChallengeProgress(id: number, progress: number): Promise<Challenge | undefined> {
    const [updatedChallenge] = await db
      .update(challenges)
      .set({ progress })
      .where(eq(challenges.id, id))
      .returning();
    
    return updatedChallenge;
  }

  // Badge operations
  async getBadges(userId: number): Promise<Badge[]> {
    return await db
      .select()
      .from(badges)
      .where(eq(badges.userId, userId));
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db.insert(badges).values({
      name: insertBadge.name,
      description: insertBadge.description,
      icon: insertBadge.icon,
      color: insertBadge.color,
      userId: insertBadge.userId || null
    }).returning();
    return badge;
  }

  // Module operations
  async getModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values({
      name: insertModule.name,
      description: insertModule.description,
      icon: insertModule.icon,
      color: insertModule.color,
      unreadNotifications: 0
    }).returning();
    return module;
  }

  // Lesson operations
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId));
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values({
      title: insertLesson.title,
      moduleId: insertLesson.moduleId || null,
      duration: insertLesson.duration,
      completed: false,
      userId: insertLesson.userId || null
    }).returning();
    return lesson;
  }
  
  async markLessonCompleted(id: number, userId: number): Promise<Lesson | undefined> {
    const [updatedLesson] = await db
      .update(lessons)
      .set({ completed: true })
      .where(and(
        eq(lessons.id, id),
        eq(lessons.userId, userId)
      ))
      .returning();
    
    return updatedLesson;
  }
}

export const storage = new DatabaseStorage();
