import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB, inMemoryStore } from "@/lib/db";
import { UserModel } from "@/models/user";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const useDB = await connectDB();

    if (useDB) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const valid = await user.comparePassword(password);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
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
      const user = await inMemoryStore.findUserByEmail(email);
      if (!user) {
        console.log("[login] user not found:", email);
        console.log("[login] all users:", inMemoryStore.debugUsers());
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      console.log("[login] found user:", user.email, "hash:", user.password.slice(0, 20));
      const valid = await bcrypt.compare(password, user.password);
      console.log("[login] password valid:", valid);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}