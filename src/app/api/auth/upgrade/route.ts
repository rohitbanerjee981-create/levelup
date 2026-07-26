import { NextResponse } from "next/server";
import { getSession, createToken } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// Allows upgrading/downgrading or updating user profile information
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await req.json();
    const { isPremium, name, bio, avatar, role } = body;

    const updates: any = {};
    if (typeof isPremium === "boolean") {
      updates.isPremium = isPremium;
      updates.premiumExpiry = isPremium ? "3 Months (Active)" : null;
    }
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    // STRICT: Only the hardcoded owner email can modify roles
    if (role && session.email === "levelupmind2026@gmail.com") {
      updates.role = role;
    }

    const [updatedUser] = await db.update(users)
      .set(updates)
      .where(eq(users.id, session.userId))
      .returning();

    if (updatedUser) {
      const payload = {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isPremium: updatedUser.isPremium
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
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error("Upgrade/Update profile error:", err);
    return NextResponse.json({ error: "Failed to update profile status." }, { status: 500 });
  }
}
