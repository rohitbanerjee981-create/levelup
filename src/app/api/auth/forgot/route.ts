import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, newPassword, verificationCode } = body;

    if (action === "forgot") {
      if (!email || !newPassword) {
        return NextResponse.json({ error: "Email and new password are required." }, { status: 400 });
      }
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
      if (!user) {
        return NextResponse.json({ error: "No account found with this email address." }, { status: 404 });
      }

      const passwordHash = hashPassword(newPassword);
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

      return NextResponse.json({ success: true, message: "Password reset successfully! You can now log in with your new password." });
    }

    if (action === "verify_email") {
      const session = await getSession();
      const targetEmail = email ? email.toLowerCase().trim() : session?.email;
      if (!targetEmail) {
        return NextResponse.json({ error: "No target user specified for verification." }, { status: 400 });
      }

      await db.update(users).set({ isVerified: true }).where(eq(users.email, targetEmail));
      return NextResponse.json({ success: true, message: "Your email address has been verified successfully!" });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Auth forgot/verify error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
