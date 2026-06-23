import mongoose from "mongoose";
import { inMemoryStore } from "@/store/in-memory";

const MONGODB_URI = process.env.MONGODB_URI || "";

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<boolean> {
  if (!MONGODB_URI) {
    console.warn("⚠️  No MONGODB_URI found — using in-memory store");
    return false;
  }

  if (cached!.conn) return true;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  try {
    cached!.conn = await cached!.promise;
    return true;
  } catch (e) {
    cached!.promise = null;
    console.error("MongoDB connection failed, falling back to in-memory", e);
    return false;
  }
}

export { inMemoryStore };