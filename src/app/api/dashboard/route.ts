import { NextResponse } from "next/server";
import { db } from "@/db";
import { 
  habits, morningRoutines, userGoals, waterLogs, advertisements, 
  articles, resources, announcements, users, siteSettings
} from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ensureSeeded } from "@/lib/db-seed";

export async function GET(req: Request) {
  try {
    await ensureSeeded();
    const session = await getSession();

    // Default to regular demo user id if testing without session
    const targetUserId = session ? session.userId : 2;

    const userHabits = await db.select().from(habits).where(eq(habits.userId, targetUserId));
    const userRoutines = await db.select().from(morningRoutines).where(eq(morningRoutines.userId, targetUserId)).orderBy(asc(morningRoutines.sortOrder), asc(morningRoutines.id));
    const goals = await db.select().from(userGoals).where(eq(userGoals.userId, targetUserId));
    
    const todayStr = new Date().toISOString().split("T")[0];
    let [waterToday] = await db.select().from(waterLogs).where(and(eq(waterLogs.userId, targetUserId), eq(waterLogs.date, todayStr)));
    if (!waterToday) {
      const [createdWater] = await db.insert(waterLogs).values({
        userId: targetUserId,
        date: todayStr,
        glasses: 2,
        goal: 8
      }).returning();
      waterToday = createdWater;
    }

    const allAds = await db.select().from(advertisements).where(eq(advertisements.status, "approved")).orderBy(desc(advertisements.createdAt));
    const allArticles = await db.select().from(articles).orderBy(desc(articles.publishedAt));
    const allResources = await db.select().from(resources).orderBy(desc(resources.createdAt));
    const activeAnnouncements = await db.select().from(announcements).where(eq(announcements.isActive, true));
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));

    // Calculate real, live aggregate stats across the database without inflated padding
    const allUsersList = await db.select().from(users);
    const allHabitsList = await db.select().from(habits);
    const allRoutinesList = await db.select().from(morningRoutines);
    const completedRoutinesList = allRoutinesList.filter(r => r.isCompleted);

    const liveStats = {
      realUsersCount: allUsersList.length,
      realHabitsCount: allHabitsList.length,
      realRoutinesDoneCount: completedRoutinesList.length,
      completionRate: allRoutinesList.length > 0 ? `${Math.round((completedRoutinesList.length / allRoutinesList.length) * 100)}%` : "100%"
    };

    let currentUser = null;
    if (session) {
      const [u] = await db.select().from(users).where(eq(users.id, session.userId));
      currentUser = u || null;
    } else {
      const [demoU] = await db.select().from(users).where(eq(users.id, targetUserId));
      currentUser = demoU || null;
    }

    return NextResponse.json({
      user: currentUser,
      habits: userHabits,
      routines: userRoutines,
      goals,
      water: waterToday,
      advertisements: allAds,
      articles: allArticles,
      resources: allResources,
      announcements: activeAnnouncements,
      settings,
      liveStats
    });
  } catch (error: any) {
    console.error("GET dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const userId = session ? session.userId : 2;
    const body = await req.json();
    const { action, item } = body;

    if (action === "create_habit") {
      const [newHabit] = await db.insert(habits).values({
        userId,
        title: item.title,
        category: item.category || "Mindset",
        streak: 1,
        completedToday: false,
        frequency: item.frequency || "Daily"
      }).returning();
      return NextResponse.json({ success: true, habit: newHabit });
    }

    if (action === "create_routine") {
      const [newRoutine] = await db.insert(morningRoutines).values({
        userId,
        title: item.title,
        time: item.time || "06:30 AM",
        duration: item.duration || "15 mins",
        icon: item.icon || "sun",
        isCompleted: false,
        sortOrder: 10
      }).returning();
      return NextResponse.json({ success: true, routine: newRoutine });
    }

    if (action === "create_goal") {
      const [newGoal] = await db.insert(userGoals).values({
        userId,
        title: item.title,
        targetDate: item.targetDate || "2026-06-30",
        progress: item.progress || 0,
        category: item.category || "Personal Growth",
        isCompleted: false
      }).returning();
      return NextResponse.json({ success: true, goal: newGoal });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("POST dashboard error:", err);
    return NextResponse.json({ error: "Failed to save data." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    const userId = session ? session.userId : 2;
    const body = await req.json();
    const { action, id, data } = body;

    if (action === "toggle_habit") {
      const [h] = await db.select().from(habits).where(eq(habits.id, id));
      if (!h) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const newStatus = !h.completedToday;
      const newStreak = newStatus ? h.streak + 1 : Math.max(1, h.streak - 1);
      const [updated] = await db.update(habits)
        .set({ completedToday: newStatus, streak: newStreak })
        .where(eq(habits.id, id))
        .returning();
      return NextResponse.json({ success: true, habit: updated });
    }

    if (action === "toggle_routine") {
      const [r] = await db.select().from(morningRoutines).where(eq(morningRoutines.id, id));
      if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const [updated] = await db.update(morningRoutines)
        .set({ isCompleted: !r.isCompleted })
        .where(eq(morningRoutines.id, id))
        .returning();
      return NextResponse.json({ success: true, routine: updated });
    }

    if (action === "update_water") {
      const todayStr = new Date().toISOString().split("T")[0];
      const [updated] = await db.update(waterLogs)
        .set({ glasses: data.glasses })
        .where(and(eq(waterLogs.userId, userId), eq(waterLogs.date, todayStr)))
        .returning();
      return NextResponse.json({ success: true, water: updated });
    }

    if (action === "update_goal") {
      const [updated] = await db.update(userGoals)
        .set({ progress: data.progress, isCompleted: data.progress >= 100 })
        .where(eq(userGoals.id, id))
        .returning();
      return NextResponse.json({ success: true, goal: updated });
    }

    return NextResponse.json({ error: "Unknown patch action" }, { status: 400 });
  } catch (err: any) {
    console.error("PATCH dashboard error:", err);
    return NextResponse.json({ error: "Failed to update item." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const type = searchParams.get("type");

    if (type === "habit") await db.delete(habits).where(eq(habits.id, id));
    if (type === "routine") await db.delete(morningRoutines).where(eq(morningRoutines.id, id));
    if (type === "goal") await db.delete(userGoals).where(eq(userGoals.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
  }
}
