import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator"; // Adjust depending on your database
import app from "./app";
import { seedAdmin } from "./core/auth/seed";
import { db } from "./core/db";
import { startWorkers } from "./modules/download-task/worker";

async function bootstrap() {
  console.log("🛠 Running migrations...");
  await migrate(db, { migrationsFolder: "./src/core/db/migrations" });
  console.log("✅ Migrations completed");

  console.log("🌱 Seeding admin user...");
  await seedAdmin();
  console.log("✅ Admin user seeded");

  console.log("🚀 Starting download task workers...");
  startWorkers(4);
  console.log("✅ Download task workers started");

  Bun.serve({ port: 3000, fetch: app.fetch, maxRequestBodySize: 1 * 1024 * 1024 * 1024 });
  console.log("🚀 Server running at http://localhost:3000");
}

bootstrap().catch((err) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
