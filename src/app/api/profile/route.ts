import { NextResponse } from "next/server";
import { connectDB, inMemoryStore } from "@/lib/db";
import { UserModel } from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
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
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const useDB = await connectDB();

    if (useDB) {
      const user = await UserModel.findByIdAndUpdate(
        payload.userId,
        { name: parsed.data.name },
        { new: true }
      ).select("-password");

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
        emailsGeneratedToday: user.emailsGeneratedToday,
      });
    } else {
      const user = await inMemoryStore.updateUser(payload.userId, {
        name: parsed.data.name,
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
        emailsGeneratedToday: user.emailsGeneratedToday,
      });
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}