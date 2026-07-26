import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
    
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials. Account not found." }, { status: 401 });
    }

    const isValid = comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isPremium: user.isPremium
    };

    const token = await createToken(payload);
    const cookieStore = await cookies();
    cookieStore.set("levelup_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax"
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        premiumExpiry: user.premiumExpiry,
        isVerified: user.isVerified,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error during login." }, { status: 500 });
  }
}
