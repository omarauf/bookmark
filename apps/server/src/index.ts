import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator"; // Adjust depending on your database
import app from "./app";
import { seedAdmin } from "./core/auth/seed";
import { db } from "./core/db";
import { startJobSystem, stopJobSystem } from "./modules/job/worker";

async function bootstrap() {
  console.log("🛠 Running migrations...");
  await migrate(db, { migrationsFolder: "./src/core/db/migrations" });
  console.log("✅ Migrations completed");

  console.log("🌱 Seeding admin user...");
  await seedAdmin();
  console.log("✅ Admin user seeded");

  console.log("🚀 Starting job system...");
  startJobSystem();
  console.log("✅ Job system started");

  const server = Bun.serve({
    port: 3000,
    fetch: app.fetch,
    maxRequestBodySize: 1 * 1024 * 1024 * 1024,
  });
  console.log("🚀 Server running at http://localhost:3000");

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    stopJobSystem();
    server.stop(true);
    console.log("✅ Graceful shutdown complete");
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
