import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, habits, morningRoutines, userGoals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields (name, email, password) are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.select().from(users).where(eq(users.email, cleanEmail));

    if (existing.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    
    // Default initial account is free user
    const [newUser] = await db.insert(users).values({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: "user",
      isPremium: false,
      isVerified: false, // User can click "Verify Email" in dashboard or verification modal
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      bio: "Excited to level up my daily discipline with LevelUp!"
    }).returning();

    // Create starting starter routines and habits for new user so their dashboard isn't empty!
    await db.insert(habits).values([
      { userId: newUser.id, title: "Drink 500ml warm water upon waking", category: "Health", streak: 1, completedToday: true, frequency: "Daily" },
      { userId: newUser.id, title: "Read 5 pages of a self-improvement book", category: "Mindset", streak: 1, completedToday: false, frequency: "Daily" },
      { userId: newUser.id, title: "No smartphone for first 30 minutes in the morning", category: "Productivity", streak: 1, completedToday: false, frequency: "Daily" },
    ]);

    await db.insert(morningRoutines).values([
      { userId: newUser.id, title: "Wake up immediately when alarm goes off", time: "06:30 AM", duration: "1 min", isCompleted: true, icon: "sun", sortOrder: 1 },
      { userId: newUser.id, title: "Hydrate: 500ml water", time: "06:32 AM", duration: "3 mins", isCompleted: true, icon: "droplet", sortOrder: 2 },
      { userId: newUser.id, title: "10 minutes quiet reflection / mindfulness", time: "06:40 AM", duration: "10 mins", isCompleted: false, icon: "wind", sortOrder: 3 },
      { userId: newUser.id, title: "Review top 3 high-priority outcomes today", time: "06:50 AM", duration: "10 mins", isCompleted: false, icon: "target", sortOrder: 4 }
    ]);

    await db.insert(userGoals).values([
      { userId: newUser.id, title: "Build a 14-day morning routine streak", targetDate: "2026-05-15", progress: 20, category: "Discipline", isCompleted: false }
    ]);

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isPremium: newUser.isPremium
    };

    const token = await createToken(payload);
    const cookieStore = await cookies();
    cookieStore.set("levelup_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax"
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isPremium: newUser.isPremium,
        premiumExpiry: newUser.premiumExpiry,
        isVerified: newUser.isVerified,
        avatar: newUser.avatar,
        bio: newUser.bio
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error during registration." }, { status: 500 });
  }
}
