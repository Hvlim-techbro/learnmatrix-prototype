import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  tier: text("tier").notNull().default("Novice Nexus"),
  avatarInitials: text("avatar_initials").notNull().default(""),
  avatarColor: text("avatar_color").notNull().default("primary"),
  streak: integer("streak").notNull().default(0),
  lastActive: timestamp("last_active").defaultNow(),
  cohortId: integer("cohort_id").references(() => cohorts.id),
});

export const cohorts = pgTable("cohorts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tier: text("tier").notNull().default("Novice Nexus"),
  memberCount: integer("member_count").notNull().default(0),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // daily, weekly, cohort, seasonal
  xpReward: integer("xp_reward").notNull(),
  badgeReward: text("badge_reward"),
  target: integer("target").notNull(),
  progress: integer("progress").notNull().default(0),
  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at"),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(), 
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), 
  color: text("color").notNull(),
  unreadNotifications: integer("unread_notifications").notNull().default(0),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  moduleId: integer("module_id").references(() => modules.id),
  duration: integer("duration").notNull(), // in seconds
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id").references(() => users.id),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  xp: true,
  level: true,
  tier: true,
  streak: true,
  lastActive: true,
});

export const insertCohortSchema = createInsertSchema(cohorts).omit({
  id: true,
  memberCount: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  progress: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  unreadNotifications: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  completed: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Cohort = typeof cohorts.$inferSelect;
export type InsertCohort = z.infer<typeof insertCohortSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
