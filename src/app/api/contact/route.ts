import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    const msgs = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    return NextResponse.json({ messages: msgs });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please fill out all fields." }, { status: 400 });
    }

    await db.insert(contactMessages).values({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      read: false
    });

    return NextResponse.json({ success: true, message: "Thank you! Your message has been sent directly to LevelUp leadership at levelup2026@gmail.com." }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
