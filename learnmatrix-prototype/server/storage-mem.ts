import {
  User, InsertUser, Module, InsertModule, Challenge, InsertChallenge,
  Badge, InsertBadge, Cohort, InsertCohort, Lesson, InsertLesson
} from '@shared/schema';

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
  private modules: Module[] = [];
  private challenges: Challenge[] = [];
  private badges: Badge[] = [];
  private cohorts: Cohort[] = [];
  private lessons: Lesson[] = [];
  private nextId = 1;

  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    console.log('Initializing LearnMatrix with complete learning ecosystem...');
    
    // Create default user
    const defaultUser: User = {
      id: this.nextId++,
      username: 'jordan',
      displayName: 'Jordan Smith',
      password: 'hashed_password',
      xp: 2850,
      level: 3,
      tier: 'Bronze',
      avatarInitials: 'JS',
      avatarColor: 'bg-gradient-primary',
      streak: 7,
      lastActive: new Date(),
      cohortId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(defaultUser);
    
    // Create default cohort
    const defaultCohort: Cohort = {
      id: this.nextId++,
      name: 'Scholar Circle Alpha',
      description: 'Elite learning group for ambitious students',
      memberCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cohorts.push(defaultCohort);
    
    // Create learning modules
    const modules = [
      {
        id: this.nextId++,
        name: 'AI Audio Tutor',
        description: 'Interactive audio-based learning sessions',
        icon: 'headphones',
        color: 'bg-gradient-blue',
        unreadNotifications: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'AI Visual Tutor',
        description: 'Visual learning with interactive diagrams',
        icon: 'monitor',
        color: 'bg-gradient-purple',
        unreadNotifications: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'Quiz Battle Arena',
        description: 'Competitive knowledge challenges',
        icon: 'zap',
        color: 'bg-gradient-yellow',
        unreadNotifications: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'Cohort Engine',
        description: 'Collaborative learning groups',
        icon: 'users',
        color: 'bg-gradient-primary',
        unreadNotifications: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'Curriculum Composer',
        description: 'Personalized learning paths',
        icon: 'book-open',
        color: 'bg-gradient-blue',
        unreadNotifications: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'BEYOND',
        description: 'Advanced research and exploration',
        icon: 'telescope',
        color: 'bg-gradient-purple',
        unreadNotifications: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.modules.push(...modules);
    
    // Create daily challenges
    const challenges = [
      {
        id: this.nextId++,
        title: 'Complete 3 Audio Lessons',
        description: 'Engage with AI tutors for deeper understanding',
        type: 'daily',
        progress: 1,
        target: 3,
        xpReward: 50,
        badgeReward: 'Audio Enthusiast',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        title: 'Win 2 Quiz Battles',
        description: 'Test your knowledge against other learners',
        type: 'daily',
        progress: 0,
        target: 2,
        xpReward: 75,
        badgeReward: 'Quiz Champion',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        title: 'Study Streak Goal',
        description: 'Maintain your learning momentum',
        type: 'daily',
        progress: 7,
        target: 7,
        xpReward: 100,
        badgeReward: 'Consistency Master',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.challenges.push(...challenges);
    
    // Create achievement badges
    const badges = [
      {
        id: this.nextId++,
        name: 'First Steps',
        description: 'Completed your first lesson',
        icon: 'award',
        color: 'accent-blue',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: 'flame',
        color: 'accent-yellow',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'Knowledge Seeker',
        description: 'Completed 10 different lessons',
        icon: 'book',
        color: 'accent-purple',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.badges.push(...badges);
    
    console.log(`✓ Initialized with ${this.users.length} users, ${this.modules.length} modules, ${this.challenges.length} challenges, ${this.badges.length} badges`);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }
  
  async updateUserXp(id: number, xp: number): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.xp += xp;
      user.updatedAt = new Date();
    }
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
    const cohort: Cohort = {
      ...insertCohort,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cohorts.push(cohort);
    return cohort;
  }
  
  async addUserToCohort(userId: number, cohortId: number): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.cohortId = cohortId;
      user.updatedAt = new Date();
    }
  }
  
  // Challenge operations
  async getChallenges(type: string): Promise<Challenge[]> {
    return this.challenges.filter(c => c.type === type);
  }
  
  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const challenge: Challenge = {
      ...insertChallenge,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.challenges.push(challenge);
    return challenge;
  }
  
  async updateChallengeProgress(id: number, progress: number): Promise<Challenge | undefined> {
    const challenge = this.challenges.find(c => c.id === id);
    if (challenge) {
      challenge.progress = progress;
      challenge.updatedAt = new Date();
    }
    return challenge;
  }
  
  // Badge operations
  async getBadges(userId: number): Promise<Badge[]> {
    return this.badges.filter(b => b.userId === userId);
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const badge: Badge = {
      ...insertBadge,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.badges.push(badge);
    return badge;
  }
  
  // Module operations
  async getModules(): Promise<Module[]> {
    return [...this.modules];
  }
  
  async createModule(insertModule: InsertModule): Promise<Module> {
    const module: Module = {
      ...insertModule,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.modules.push(module);
    return module;
  }
  
  // Lesson operations
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return this.lessons.filter(l => l.moduleId === moduleId);
  }
  
  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      ...insertLesson,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.lessons.push(lesson);
    return lesson;
  }
  
  async markLessonCompleted(id: number, userId: number): Promise<Lesson | undefined> {
    const lesson = this.lessons.find(l => l.id === id);
    if (lesson) {
      lesson.completed = true;
      lesson.updatedAt = new Date();
    }
    return lesson;
  }
}

export const storage = new MemStorage();
