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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cohorts: Map<number, Cohort>;
  private challenges: Map<number, Challenge>;
  private badges: Map<number, Badge>;
  private modules: Map<number, Module>;
  private lessons: Map<number, Lesson>;
  
  private userId: number;
  private cohortId: number;
  private challengeId: number;
  private badgeId: number;
  private moduleId: number;
  private lessonId: number;

  constructor() {
    this.users = new Map();
    this.cohorts = new Map();
    this.challenges = new Map();
    this.badges = new Map();
    this.modules = new Map();
    this.lessons = new Map();
    
    this.userId = 1;
    this.cohortId = 1;
    this.challengeId = 1;
    this.badgeId = 1;
    this.moduleId = 1;
    this.lessonId = 1;
    
    // Initialize with default data
    this.initDefaultData();
  }
  
  private initDefaultData() {
    // Create modules
    const moduleData: InsertModule[] = [
      { name: "AI Audio Tutor", description: "Learn with podcast-style lessons", icon: "microphone-alt", color: "accent-blue" },
      { name: "AI Visual Tutor", description: "Interactive whiteboard learning", icon: "chalkboard-teacher", color: "accent-purple" },
      { name: "Quiz Battle Arena", description: "Test your knowledge against others", icon: "trophy", color: "secondary" },
      { name: "Cohort Engine", description: "Learn together with peers", icon: "users", color: "accent-green" },
      { name: "Curriculum Composer", description: "Personalized learning paths", icon: "book-open", color: "accent-yellow" },
      { name: "BEYOND", description: "Advanced research tools", icon: "rocket", color: "primary" },
    ];
    
    moduleData.forEach(mod => this.createModule(mod));
    
    // Create default cohort
    this.createCohort({
      name: "AI Enthusiasts",
      description: "A group of learners focused on artificial intelligence and machine learning",
      tier: "Scholar Circle"
    });
    
    // Create some default challenges
    this.createChallenge({
      title: "Complete 1 quiz battle",
      description: "Win a battle in the Quiz Arena",
      type: "daily",
      xpReward: 15,
      target: 1,
      userId: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    this.createChallenge({
      title: "Highlight a concept in Visual Tutor",
      description: "Find and highlight key concepts",
      type: "daily",
      xpReward: 10,
      target: 3,
      progress: 2,
      userId: 1,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    // Create lessons for audio tutor
    const audioTutorLessons = [
      { title: "Introduction to Neural Networks", moduleId: 1, duration: 765, userId: 1 },
      { title: "Training Neural Networks", moduleId: 1, duration: 930, userId: 1 },
      { title: "Applications of Neural Networks", moduleId: 1, duration: 1100, userId: 1 },
      { title: "Advanced Neural Network Architectures", moduleId: 1, duration: 1215, userId: 1 }
    ];
    
    audioTutorLessons.forEach(lesson => this.createLesson(lesson));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      xp: 0, 
      level: 1, 
      tier: "Novice Nexus",
      streak: 0,
      lastActive: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserXp(id: number, xp: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      xp: user.xp + xp,
      level: Math.floor(user.xp / 300) + 1
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getUserChallenges(userId: number): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      challenge => challenge.userId === userId
    );
  }

  // Cohort operations
  async getCohort(id: number): Promise<Cohort | undefined> {
    return this.cohorts.get(id);
  }

  async createCohort(insertCohort: InsertCohort): Promise<Cohort> {
    const id = this.cohortId++;
    const cohort: Cohort = { ...insertCohort, id, memberCount: 0 };
    this.cohorts.set(id, cohort);
    return cohort;
  }
  
  async addUserToCohort(userId: number, cohortId: number): Promise<void> {
    const user = await this.getUser(userId);
    const cohort = await this.getCohort(cohortId);
    
    if (!user || !cohort) return;
    
    // Update user with cohort ID
    const updatedUser = { ...user, cohortId };
    this.users.set(userId, updatedUser);
    
    // Update cohort member count
    const updatedCohort = { ...cohort, memberCount: cohort.memberCount + 1 };
    this.cohorts.set(cohortId, updatedCohort);
  }

  // Challenge operations
  async getChallenges(type: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      challenge => challenge.type === type
    );
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeId++;
    const challenge: Challenge = { 
      ...insertChallenge, 
      id, 
      progress: insertChallenge.progress || 0
    };
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  async updateChallengeProgress(id: number, progress: number): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge = { ...challenge, progress };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  // Badge operations
  async getBadges(userId: number): Promise<Badge[]> {
    return Array.from(this.badges.values()).filter(
      badge => badge.userId === userId
    );
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.badgeId++;
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }

  // Module operations
  async getModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.moduleId++;
    const module: Module = { ...insertModule, id, unreadNotifications: 0 };
    this.modules.set(id, module);
    return module;
  }

  // Lesson operations
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      lesson => lesson.moduleId === moduleId
    );
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.lessonId++;
    const lesson: Lesson = { ...insertLesson, id, completed: false };
    this.lessons.set(id, lesson);
    return lesson;
  }
  
  async markLessonCompleted(id: number, userId: number): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson || lesson.userId !== userId) return undefined;
    
    const updatedLesson = { ...lesson, completed: true };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }
}

export const storage = new MemStorage();
