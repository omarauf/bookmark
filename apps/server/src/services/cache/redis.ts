import IORedis from "ioredis";
import { env } from "@/config/env";

let redisConnection: IORedis | null = null;

export function connectRedis() {
  if (redisConnection) {
    return redisConnection;
  }

  redisConnection = new IORedis({
    host: env.REDIS_HOST || "127.0.0.1",
    port: Number(env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
  });

  return redisConnection;
}

export async function checkRedisConnection() {
  const connection = connectRedis();

  if (!connection) {
    console.error("❌ Redis connection has not been initialized.");
    process.exit(1);
  }

  try {
    await connection.ping();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    process.exit(1);
  }
}
