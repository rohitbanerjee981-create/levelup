import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const RESPONSES_ROUTINE = [
  "Based on your target waking time, here is an optimized 4-Step Neuro-Morning Shield: 1) Immediately open blinds for natural UV photon exposure (2 mins). 2) Drink 600ml water with electrolytes. 3) Perform 10 minutes of deep physiological sighs (2 quick inhales, long vocal exhale). 4) Engage in a 90-minute Deep Work sprint before opening your email or phone messaging apps!",
  "To level up your habit persistence: Implement 'Habit Stacking'. Right after you finish brushing your teeth at night, immediately place your workout clothes and running shoes on top of your smartphone. When your alarm sounds at 5:30 AM, putting on your gear becomes your very first physical obstacle!",
  "Here is your high-performance self-discipline schedule for today: 06:00 AM - Rise & Hydration; 06:15 AM - 20 min Cardio Activation; 07:00 AM - Deep Focus Session #1 (No notifications); 11:30 AM - Admin / Email processing; 05:00 PM - Daily Review & Gratitude journaling. Keep your 100% streak alive!",
  "When you feel motivation slipping, apply the 5-Second Rule: Count backward 5-4-3-2-1 and immediately physically move your body toward the task before your amygdala invents rationalizations. Willpower is like a muscle; flexing it when you least desire to builds unbeatable grit."
];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { prompt, topic } = await req.json();

    let user = null;
    if (session) {
      const [u] = await db.select().from(users).where(eq(users.id, session.userId));
      user = u;
    }

    const isPremium = user?.isPremium || false;

    // If free user and requesting deep custom features, let's give them a strong tip plus a gentle notice
    if (!isPremium && (topic === "advanced_analytics" || topic === "unlimited_consultation")) {
      return NextResponse.json({
        limited: true,
        message: "Unlock LevelUp Premium (just ₹200 for 3 Months) for Unlimited AI Productivity Assistant consultations, deep emotional reframing, and automated calendar export! Here is a Free productivity insight in the meantime:",
        response: RESPONSES_ROUTINE[Math.floor(Math.random() * RESPONSES_ROUTINE.length)]
      });
    }

    // Generate intelligent response tailored to their input
    let customResponse = "";
    if (prompt && prompt.toLowerCase().includes("water")) {
      customResponse = "Hydration is the engine of morning cognition. Mild dehydration (just 1.5% body water deficit) shrinks brain tissue volume and triggers fatigue and brain fog. Keep a glass 750ml thermal bottle next to your pillow every night!";
    } else if (prompt && (prompt.toLowerCase().includes("procrastinat") || prompt.toLowerCase().includes("focus"))) {
      customResponse = "To defeat procrastination, stop focusing on completing the entire colossal project. Instead, commit ONLY to 'Opening the document and working for literally 5 minutes without judging quality'. Once physical motion starts, neurological momentum takes over!";
    } else if (prompt && prompt.toLowerCase().includes("sleep")) {
      customResponse = "Elite mornings are forged the evening prior. Implement a strict digital sunset 60 minutes before bedtime, set ambient bedroom room temperature to 18°C (65°F), and avoid heavy meals or alcohol within 3 hours of sleep.";
    } else {
      customResponse = RESPONSES_ROUTINE[Math.floor(Math.random() * RESPONSES_ROUTINE.length)];
    }

    return NextResponse.json({
      success: true,
      isPremium,
      response: customResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    console.error("AI Assistant Error:", err);
    return NextResponse.json({ error: "AI assistant service encountered an error." }, { status: 500 });
  }
}
