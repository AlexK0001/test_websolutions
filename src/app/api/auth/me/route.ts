import { NextResponse } from "next/server";
import { connectDB, inMemoryStore } from "@/lib/db";
import { UserModel } from "@/models/user";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const useDB = await connectDB();

    if (useDB) {
      const user = await UserModel.findById(payload.userId).select("-password");
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
      const user = await inMemoryStore.findUserById(payload.userId);
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
    console.error("Me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}