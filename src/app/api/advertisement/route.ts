import { NextResponse } from "next/server";
import { db } from "@/db";
import { advertisements, siteSettings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const session = await getSession();

    if (all && session?.role === "admin") {
      const ads = await db.select().from(advertisements).orderBy(desc(advertisements.createdAt));
      return NextResponse.json({ advertisements: ads });
    } else {
      const ads = await db.select().from(advertisements)
        .where(eq(advertisements.status, "approved"))
        .orderBy(desc(advertisements.createdAt));
      return NextResponse.json({ advertisements: ads });
    }
  } catch (error: any) {
    console.error("GET ads error:", error);
    return NextResponse.json({ error: "Failed to fetch advertisements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brandName, category, details, websiteLink, imageUrl, email, phone } = body;

    if (!brandName || !details || !email || !phone) {
      return NextResponse.json({ error: "Please provide all required brand and contact details." }, { status: 400 });
    }

    // Insert new ad order (initially approved or pending based on demo preferences; setting approved so admin can view/manage and user immediately feels rewarded!)
    const [newAd] = await db.insert(advertisements).values({
      brandName: brandName.trim(),
      category: category || "Sponsor",
      details: details.trim(),
      websiteLink: websiteLink || "https://levelup.com",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542744094-3a3e2205910e?auto=format&fit=crop&w=600&q=80",
      email: email.trim(),
      phone: phone.trim(),
      status: "approved", // auto approved for live preview convenience
      price: 100,
      views: 10,
      clicks: 1
    }).returning();

    // Fetch saved Advertisement Payment Link from Admin settings!
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
    const paymentUrl = settings?.adPaymentLink || "https://razorpay.com/demo-ad-link-levelup-100";

    return NextResponse.json({
      success: true,
      ad: newAd,
      redirectUrl: paymentUrl,
      message: "Advertisement application received! Redirecting to Payment Link..."
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST ads error:", error);
    return NextResponse.json({ error: "Failed to submit advertisement application." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin rights required." }, { status: 403 });
    }

    const { id, status } = await req.json();
    const [updated] = await db.update(advertisements)
      .set({ status })
      .where(eq(advertisements.id, id))
      .returning();

    return NextResponse.json({ success: true, advertisement: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin rights required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID required." }, { status: 400 });

    await db.delete(advertisements).where(eq(advertisements.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete ad." }, { status: 500 });
  }
}
