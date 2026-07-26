import { db } from "@/db";
import { 
  users, siteSettings, habits, morningRoutines, userGoals, 
  advertisements, articles, resources, announcements 
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

let isSeeded = false;

export async function ensureSeeded() {
  if (isSeeded) return;
  try {
    // 1. Ensure site settings exist with honest starting baseline
    try {
      const existingSettings = await db.select().from(siteSettings).limit(1);
      if (existingSettings.length === 0) {
        await db.insert(siteSettings).values({
          id: 1,
          homepageTitle: "Level Up Your Life Every Single Day",
          homepageSubtitle: "Build better habits, improve your morning routine, and unlock your best self.",
          premiumPaymentLink: "https://razorpay.com/demo-premium-link-levelup-200",
          adPaymentLink: "https://razorpay.com/demo-ad-link-levelup-100",
          premiumPrice: "₹200",
          premiumDuration: "3 Months",
          adPrice: "₹100 for 1 Month",
          linkGetPremium: "/premium",
          linkContact: "/contact",
          linkAdvertisement: "/advertisement",
          linkDownload: "/dashboard?tab=resources",
          linkBlog: "/blog",
          linkLogin: "/login",
          linkSignUp: "/signup",
          statsUsersCount: 0,
          statsHabitsTracked: 0,
          statsRoutinesDone: 0,
          statsSatisfactionRate: "100%",
          customFooterText: "© 2026 LevelUp. All Rights Reserved."
        });
      }
    } catch (e: any) {
      if (!e.message?.includes("duplicate key") && !e.code && e.code !== "23505") {
        console.error("Settings seed note:", e.message || e);
      }
    }

    // 2. Ensure starting accounts exist for administration & real app testing
    try {
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length === 0) {
        const adminPass = hashPassword("admin123");
        const userPass = hashPassword("user123");

      const privateAdminPass = hashPassword("rohitbanerjeelevelup10187");
      const [adminUser] = await db.insert(users).values({
        name: "Rohit Banerjee (Owner)",
        email: "levelupmind2026@gmail.com",
        passwordHash: privateAdminPass,
        role: "admin",
        isPremium: true,
        premiumExpiry: "2030-12-31",
        isVerified: true,
        bio: "Sole Platform Administrator.",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
      }).returning();

        const [regularUser] = await db.insert(users).values({
          name: "Example Free Member",
          email: "user@levelup.com",
          passwordHash: userPass,
          role: "user",
          isPremium: false,
          isVerified: true,
          bio: "Using LevelUp Free plan to organize daily discipline.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
        }).returning();

        const [premiumUser] = await db.insert(users).values({
          name: "Example Premium Member",
          email: "premium@levelup.com",
          passwordHash: userPass,
          role: "user",
          isPremium: true,
          premiumExpiry: "3 Months (Active)",
          isVerified: true,
          bio: "LevelUp Premium unlocked. Enjoying an ad-free habit tracking experience.",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
        }).returning();

        if (regularUser && premiumUser) {
          await db.insert(habits).values([
            { userId: regularUser.id, title: "Read 10 pages of a book", category: "Mindset", streak: 3, completedToday: true, frequency: "Daily" },
            { userId: regularUser.id, title: "No smartphone for 1st hour after waking", category: "Productivity", streak: 2, completedToday: false, frequency: "Daily" },
            { userId: regularUser.id, title: "Drink 500ml water upon waking", category: "Health", streak: 4, completedToday: true, frequency: "Daily" },
            { userId: premiumUser.id, title: "90-Minute Uninterrupted Work Block", category: "Productivity", streak: 7, completedToday: true, frequency: "Weekdays" },
            { userId: premiumUser.id, title: "Daily Journaling & Reflection", category: "Mindset", streak: 10, completedToday: true, frequency: "Daily" },
          ]);

          await db.insert(morningRoutines).values([
            { userId: regularUser.id, title: "Wake up immediately without snooze", time: "06:00 AM", duration: "1 min", isCompleted: true, icon: "sun", sortOrder: 1 },
            { userId: regularUser.id, title: "Hydrate: Drink 500ml water", time: "06:02 AM", duration: "3 mins", isCompleted: true, icon: "droplet", sortOrder: 2 },
            { userId: regularUser.id, title: "15-minute mindfulness or breathwork", time: "06:10 AM", duration: "15 mins", isCompleted: false, icon: "wind", sortOrder: 3 },
            { userId: regularUser.id, title: "Light stretching & body movement", time: "06:25 AM", duration: "15 mins", isCompleted: false, icon: "activity", sortOrder: 4 },
            { userId: regularUser.id, title: "Review Top 3 priorities for today", time: "06:40 AM", duration: "10 mins", isCompleted: false, icon: "target", sortOrder: 5 },
            
            { userId: premiumUser.id, title: "5:30 AM Awakening", time: "05:30 AM", duration: "2 mins", isCompleted: true, icon: "sun", sortOrder: 1 },
            { userId: premiumUser.id, title: "AI Productivity Assistant morning check-in", time: "05:35 AM", duration: "15 mins", isCompleted: true, icon: "bot", sortOrder: 2 },
            { userId: premiumUser.id, title: "Morning exercise & conditioning", time: "05:50 AM", duration: "45 mins", isCompleted: true, icon: "activity", sortOrder: 3 }
          ]);

          await db.insert(userGoals).values([
            { userId: regularUser.id, title: "Maintain a 14-day morning routine streak", targetDate: "2026-06-30", progress: 50, category: "Discipline", isCompleted: false },
            { userId: premiumUser.id, title: "Complete quarterly business project objectives", targetDate: "2026-08-15", progress: 70, category: "Career", isCompleted: false }
          ]);
        }
      }
    } catch (uErr: any) {
      if (!uErr.message?.includes("duplicate")) console.error("Users seed note:", uErr.message);
    }

    // 3. Ensure Advertisements are authentic and transparent
    try {
      const existingAds = await db.select().from(advertisements).limit(1);
      if (existingAds.length === 0) {
        await db.insert(advertisements).values([
          {
            brandName: "Available Sponsorship Slot",
            category: "Community Sponsor",
            details: "Your brand advertisement can be featured right here across Free user dashboards! Promote your business to disciplined self-improvers for just ₹100 for 1 Month.",
            websiteLink: "/advertisement",
            imageUrl: "/images/demo-ad.jpg",
            email: "levelup2026@gmail.com",
            phone: "+91 0000000000",
            status: "approved",
            price: 100,
            views: 1,
            clicks: 0
          }
        ]);
      }
    } catch (adErr) {}

    // 4. Ensure Articles exist with authentic editorial attribution (no fabricated names)
    try {
      const existingArticles = await db.select().from(articles).limit(1);
      if (existingArticles.length === 0) {
        await db.insert(articles).values([
          {
            title: "The 60-Minute Morning Reset: How Your First Waking Hour Defines Your Day",
            slug: "60-minute-morning-reset",
            excerpt: "Understanding how taking calm, deliberate control of your first 60 minutes after waking transforms focus and daily persistence.",
            content: `When you open your eyes in the morning, your mind is transitioning into an active mental state. How you spend this initial transition window sets the tempo for your day.

If you immediately reach for your phone to scroll social media or read incoming messages, your mind defaults to a reactive posture before you even step out of bed.

### Step 1: Delay Screen Time
For the first 30 to 45 minutes after waking up, leave your phone in another room or inside a drawer. Give your brain quiet space to awaken without immediate digital input.

### Step 2: Immediate Hydration
After 7 to 8 hours of sleep, your body requires natural rehydration. Before coffee or tea, drink at least 500ml of water to support alertness and physical well-being.

### Step 3: Natural Sunlight Exposure
Within 15 minutes of rising, step near a bright window or outdoors to receive natural morning light. This signals your circadian system that the day has begun and helps stabilize energy levels.

Level Up your morning routine today—keep your checklist simple, focus on consistency, and build authentic discipline over time!`,
            category: "Morning Routine",
            isPremium: false,
            author: "LevelUp Editorial Team",
            imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
          },
          {
            title: "Building Reliable Habits: Designing Frictionless Systems That Stick",
            slug: "building-reliable-habits-systems",
            excerpt: "Willpower alone can be exhausting. Discover how designing simple environmental cues makes helpful habits easier to follow.",
            content: `Many self-improvers try to adopt numerous ambitious habits simultaneously relying solely on excitement and raw effort. However, when busy schedules or tiredness arrive, habits built only on willpower often fall apart.

### Systems vs. Motivation
When daily motivation naturally varies, the simplicity of your routine and environment determines whether a habit continues.

#### 1. Reduce Activation Friction (The 20-Second Principle)
To establish a helpful habit, make starting it as easy and accessible as possible. For example, lay out your exercise gear right beside your bed the night before, or place a full water glass next to your alarm clock.

#### 2. Habit Stacking
Attach a new habit directly onto an existing everyday behavior that you already perform automatically:
* *"After I brush my teeth every morning, I will immediately drink my morning glass of water."*
* *"After I pour my coffee, I will write down my single most important priority for the workday."*

#### 3. Aim for Consistency Over Perfection
If an unexpected emergency or travel forces you to miss a day, focus simply on returning to the rhythm the very next morning. Consistency is built over weeks and months of steady practice.`,
            category: "Habit Systems",
            isPremium: true,
            author: "LevelUp Editorial Team",
            imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
          },
          {
            title: "Defending Focus: Maintaining Attention During Deep Work Sessions",
            slug: "defending-focus-deep-work",
            excerpt: "In an environment filled with alerts and notifications, dedicated blocks of undisturbed attention are essential for meaningful achievement.",
            content: `Modern workflows are frequently interrupted by notifications, chat badges, and inbox alerts. Yet, demanding creative and technical tasks require undisturbed cognitive focus.

### Minimizing Attention Switching
When you repeatedly switch between a primary work task and incoming notifications, your focus is fragmented. Even quick interruptions require time and energy before your concentration returns fully to the task at hand.

### Establishing Dedicated Focus Periods
To structure your workday for calm productivity:
1. **Time-Block Focused Sessions**: Schedule 60 to 90-minute focus blocks on your calendar where notifications are paused.
2. **Batch Communication**: Check and respond to messages at set intervals during the day rather than checking continuously.
3. **Organize Your Workspace**: Clear unneeded browser tabs and keep your physical workspace orderly during focus intervals.`,
            category: "Productivity",
            isPremium: false,
            author: "LevelUp Editorial Team",
            imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
          }
        ]);
      }
    } catch (artErr) {}

    // 5. Ensure Resources exist with genuine zero starter counts
    try {
      const existingResources = await db.select().from(resources).limit(1);
      if (existingResources.length === 0) {
        await db.insert(resources).values([
          {
            title: "LevelUp Habit & Routine Tracking Guidebook (.PDF)",
            description: "A simple, clean structural guide and printable template designed to help you plan your morning checklist and weekly consistency goals.",
            fileUrl: "/logo.svg",
            fileType: "PDF Guide",
            size: "1.4 MB",
            isPremiumOnly: true,
            downloads: 0
          },
          {
            title: "Morning Routine Quick-Start Visual Template",
            description: "A printable 1-page daily protocol checklist to place on your desk or room for easy daily tracking.",
            fileUrl: "/logo.svg",
            fileType: "PDF Checklist",
            size: "0.8 MB",
            isPremiumOnly: false,
            downloads: 0
          },
          {
            title: "Time-Blocking & Priority Worksheet",
            description: "An organized sheet layout to plan your weekly top goals and structure 90-minute focus blocks without distractions.",
            fileUrl: "/logo.svg",
            fileType: "Template",
            size: "1.1 MB",
            isPremiumOnly: true,
            downloads: 0
          }
        ]);
      }
    } catch (resErr) {}

    // 6. Ensure Announcements exist with genuine platform info
    try {
      const existingAnnouncements = await db.select().from(announcements).limit(1);
      if (existingAnnouncements.length === 0) {
        await db.insert(announcements).values([
          {
            title: "Welcome to LevelUp: Build Better Morning Habits & Self-Discipline",
            content: "Explore our daily Habit Tracker and AI Productivity Assistant. Customize your morning routine and log your hydration daily!",
            type: "feature",
            target: "all",
            isActive: true
          },
          {
            title: "Upgrade to Premium: Ad-Free Dashboard & AI Coach Access for ₹200",
            content: "Unlock unlimited AI Productivity Assistant interactions, goal tracking, weekly reports, and an entirely ad-free experience for ₹200 for 3 Months.",
            type: "info",
            target: "free",
            isActive: true
          }
        ]);
      }
    } catch (annErr) {}

    isSeeded = true;
  } catch (error) {
    // Silently continue during static builds
  }
}
