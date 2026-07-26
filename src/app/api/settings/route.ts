import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ensureSeeded } from "@/lib/db-seed";

export async function GET() {
  try {
    await ensureSeeded();
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    
    // Clean and apply updates to settings ID 1
    const [updated] = await db.update(siteSettings)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(siteSettings.id, 1))
      .returning();

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Failed to update site settings." }, { status: 500 });
  }
}
