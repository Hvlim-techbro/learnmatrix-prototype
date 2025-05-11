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
  private users: User[] = [];
  private cohorts: Cohort[] = [];
  private challenges: Challenge[] = [];
  private badges: Badge[] = [];
  private modules: Module[] = [];
  private lessons: Lesson[] = [];
  private nextIds = {
    user: 1,
    cohort: 1,
    challenge: 1,
    badge: 1,
    module: 1,
    lesson: 1
  };

  constructor() {
    // Initialize with default data
    this.initDefaultData();
  }
  
  private async initDefaultData() {
    if (this.users.length > 0) {
      console.log('Memory storage already initialized with data');
      return;
    }
    
    console.log('Initializing memory storage with default data...');
    
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
    
    console.log('Memory storage successfully initialized with default data');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.nextIds.user++,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName,
      avatarInitials: insertUser.avatarInitials || "",
      avatarColor: insertUser.avatarColor || "primary",
      xp: 0,
      level: 1,
      tier: "Novice Nexus",
      streak: 0,
      cohortId: null,
      lastActive: new Date(),
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  async updateUserXp(id: number, xp: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const newXp = user.xp + xp;
    const newLevel = Math.floor(newXp / 300) + 1;
    
    user.xp = newXp;
    user.level = newLevel;
    
    return user;
  }
  
  async getUserChallenges(userId: number): Promise<Challenge[]> {
    return this.challenges.filter(c => c.userId === userId);
  }

  // Cohort operations
  async getCohort(id: number): Promise<Cohort | undefined> {
    return this.cohorts.find(c => c.id === id);
  }

  async createCohort(insertCohort: InsertCohort): Promise<Cohort> {
    const newCohort: Cohort = {
      id: this.nextIds.cohort++,
      name: insertCohort.name,
      description: insertCohort.description,
      tier: insertCohort.tier || "Novice Nexus",
      memberCount: 0,
      createdAt: new Date()
    };
    
    this.cohorts.push(newCohort);
    return newCohort;
  }
  
  async addUserToCohort(userId: number, cohortId: number): Promise<void> {
    const user = await this.getUser(userId);
    const cohort = await this.getCohort(cohortId);
    
    if (!user || !cohort) return;
    
    // Update user with cohort ID
    user.cohortId = cohortId;
    
    // Update cohort member count
    cohort.memberCount += 1;
  }

  // Challenge operations
  async getChallenges(type: string): Promise<Challenge[]> {
    return this.challenges.filter(c => c.type === type);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const newChallenge: Challenge = {
      id: this.nextIds.challenge++,
      title: insertChallenge.title,
      description: insertChallenge.description,
      type: insertChallenge.type,
      xpReward: insertChallenge.xpReward,
      badgeReward: insertChallenge.badgeReward || null,
      target: insertChallenge.target,
      progress: 0,
      userId: insertChallenge.userId || null,
      expiresAt: insertChallenge.expiresAt || null,
      createdAt: new Date()
    };
    
    this.challenges.push(newChallenge);
    return newChallenge;
  }
  
  async updateChallengeProgress(id: number, progress: number): Promise<Challenge | undefined> {
    const challenge = this.challenges.find(c => c.id === id);
    if (!challenge) return undefined;
    
    challenge.progress = progress;
    return challenge;
  }

  // Badge operations
  async getBadges(userId: number): Promise<Badge[]> {
    return this.badges.filter(b => b.userId === userId);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const newBadge: Badge = {
      id: this.nextIds.badge++,
      name: insertBadge.name,
      description: insertBadge.description,
      icon: insertBadge.icon,
      color: insertBadge.color,
      userId: insertBadge.userId || null,
      createdAt: new Date()
    };
    
    this.badges.push(newBadge);
    return newBadge;
  }

  // Module operations
  async getModules(): Promise<Module[]> {
    return [...this.modules];
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const newModule: Module = {
      id: this.nextIds.module++,
      name: insertModule.name,
      description: insertModule.description,
      icon: insertModule.icon,
      color: insertModule.color,
      unreadNotifications: 0,
      createdAt: new Date()
    };
    
    this.modules.push(newModule);
    return newModule;
  }

  // Lesson operations
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return this.lessons.filter(l => l.moduleId === moduleId);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const newLesson: Lesson = {
      id: this.nextIds.lesson++,
      title: insertLesson.title,
      moduleId: insertLesson.moduleId || null,
      duration: insertLesson.duration,
      completed: false,
      userId: insertLesson.userId || null,
      createdAt: new Date()
    };
    
    this.lessons.push(newLesson);
    return newLesson;
  }
  
  async markLessonCompleted(id: number, userId: number): Promise<Lesson | undefined> {
    const lesson = this.lessons.find(l => l.id === id && l.userId === userId);
    if (!lesson) return undefined;
    
    lesson.completed = true;
    return lesson;
  }
}

export const storage = new MemStorage();
