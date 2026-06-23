import { NextResponse } from "next/server";
import { connectDB, inMemoryStore } from "@/lib/db";
import { UserModel } from "@/models/user";
import { signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const useDB = await connectDB();

    if (useDB) {
      const existing = await UserModel.findOne({ email });
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      const user = await UserModel.create({ name, email, password });
      const token = signToken({ userId: user._id.toString(), email: user.email });
      return NextResponse.json({
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          plan: user.plan,
          createdAt: user.createdAt,
          emailsGeneratedToday: user.emailsGeneratedToday,
        },
      });
    } else {
      const existing = await inMemoryStore.findUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      const user = await inMemoryStore.createUser({ name, email, password });
      const token = signToken({ userId: user._id, email: user.email });
      return NextResponse.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          createdAt: user.createdAt,
          emailsGeneratedToday: user.emailsGeneratedToday,
        },
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}