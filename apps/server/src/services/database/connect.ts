import { env } from "@/config/env";
import mongoose from "./mongoose";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
