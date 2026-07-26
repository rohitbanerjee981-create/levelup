import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  isPremium: boolean("is_premium").notNull().default(false),
  premiumExpiry: text("premium_expiry"), // ISO string or human formatted date
  isVerified: boolean("is_verified").notNull().default(true),
  avatar: text("avatar").default("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"),
  bio: text("bio").default("On a mission to conquer my daily habits and level up!"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  homepageTitle: text("homepage_title").notNull().default("Level Up Your Life Every Single Day"),
  homepageSubtitle: text("homepage_subtitle").notNull().default("Build better habits, improve your morning routine, and unlock your best self."),
  premiumPaymentLink: text("premium_payment_link").notNull().default("https://razorpay.com/demo-premium-link-levelup-200"),
  adPaymentLink: text("ad_payment_link").notNull().default("https://razorpay.com/demo-ad-link-levelup-100"),
  premiumPrice: text("premium_price").notNull().default("₹200"),
  premiumDuration: text("premium_duration").notNull().default("3 Months"),
  adPrice: text("ad_price").notNull().default("₹100 for 1 Month"),
  // Link Manager URLs
  linkGetPremium: text("link_get_premium").notNull().default("/premium"),
  linkContact: text("link_contact").notNull().default("/contact"),
  linkAdvertisement: text("link_advertisement").notNull().default("/advertisement"),
  linkDownload: text("link_download").notNull().default("/dashboard?tab=resources"),
  linkBlog: text("link_blog").notNull().default("/blog"),
  linkLogin: text("link_login").notNull().default("/login"),
  linkSignUp: text("link_signup").notNull().default("/signup"),
  // Stats
  statsUsersCount: integer("stats_users_count").notNull().default(12450),
  statsHabitsTracked: integer("stats_habits_tracked").notNull().default(48900),
  statsRoutinesDone: integer("stats_routines_done").notNull().default(312000),
  statsSatisfactionRate: text("stats_satisfaction_rate").notNull().default("99.4%"),
  customFooterText: text("custom_footer_text").notNull().default("© 2026 LevelUp. All Rights Reserved."),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Mindset"), // Mindset, Health, Fitness, Productivity
  streak: integer("streak").notNull().default(1),
  completedToday: boolean("completed_today").notNull().default(false),
  frequency: text("frequency").notNull().default("Daily"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const morningRoutines = pgTable("morning_routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  time: text("time").notNull().default("06:30 AM"),
  duration: text("duration").notNull().default("15 mins"),
  isCompleted: boolean("is_completed").notNull().default(false),
  icon: text("icon").default("sun"),
  sortOrder: integer("sort_order").default(0),
});

export const userGoals = pgTable("user_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  targetDate: text("target_date").notNull(),
  progress: integer("progress").notNull().default(20), // 0 to 100
  category: text("category").notNull().default("Personal Growth"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const waterLogs = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  glasses: integer("glasses").notNull().default(3),
  goal: integer("goal").notNull().default(8),
});

export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  category: text("category").notNull(),
  details: text("details").notNull(),
  websiteLink: text("website_link").notNull(),
  imageUrl: text("image_url").notNull().default("https://images.unsplash.com/photo-1542744094-3a3e2205910e?auto=format&fit=crop&w=600&q=80"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("approved"), // pending, approved, rejected
  price: integer("price").notNull().default(100), // ₹100
  views: integer("views").notNull().default(340),
  clicks: integer("clicks").notNull().default(42),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("Habit Building"),
  isPremium: boolean("is_premium").notNull().default(false),
  author: text("author").notNull().default("LevelUp Coach"),
  imageUrl: text("image_url").notNull().default("https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80"),
  readTime: text("read_time").notNull().default("4 min read"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull().default("/resources/sample-habit-tracker-guide.pdf"),
  fileType: text("file_type").notNull().default("PDF Guide"),
  size: text("size").notNull().default("2.4 MB"),
  isPremiumOnly: boolean("is_premium_only").notNull().default(true),
  downloads: integer("downloads").notNull().default(128),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("feature"), // feature, discount, info, alert
  target: text("target").notNull().default("all"), // all, premium, free
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type MorningRoutine = typeof morningRoutines.$inferSelect;
export type UserGoal = typeof userGoals.$inferSelect;
export type WaterLog = typeof waterLogs.$inferSelect;
export type Advertisement = typeof advertisements.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
