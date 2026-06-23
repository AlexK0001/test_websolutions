import { NextResponse } from "next/server";
import { connectDB, inMemoryStore } from "@/lib/db";
import { UserModel } from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { emailService } from "@/services/ai";
import { generateEmailSchema } from "@/lib/validations";

const FREE_DAILY_LIMIT = 10;

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = generateEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const useDB = await connectDB();

    // Check rate limit
    if (useDB) {
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.plan === "free") {
        const today = new Date();
        const lastDate = user.lastEmailDate ? new Date(user.lastEmailDate) : null;
        const isNewDay = !lastDate || lastDate.toDateString() !== today.toDateString();
        const count = isNewDay ? 0 : user.emailsGeneratedToday;

        if (count >= FREE_DAILY_LIMIT) {
          return NextResponse.json(
            { error: "Daily limit reached. Upgrade to Premium for unlimited emails." },
            { status: 429 }
          );
        }

        await UserModel.findByIdAndUpdate(payload.userId, {
          emailsGeneratedToday: isNewDay ? 1 : count + 1,
          lastEmailDate: today,
        });
      }
    } else {
      const user = await inMemoryStore.findUserById(payload.userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.plan === "free") {
        const today = new Date();
        const lastDate = user.lastEmailDate ? new Date(user.lastEmailDate) : null;
        const isNewDay = !lastDate || lastDate.toDateString() !== today.toDateString();
        const count = isNewDay ? 0 : user.emailsGeneratedToday;

        if (count >= FREE_DAILY_LIMIT) {
          return NextResponse.json(
            { error: "Daily limit reached. Upgrade to Premium for unlimited emails." },
            { status: 429 }
          );
        }

        await inMemoryStore.incrementEmailCount(payload.userId);
      }
    }

    const result = await emailService.generate(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
  }
}