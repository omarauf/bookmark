import "dotenv/config";
import app from "./app";
import { checkWorkerStatus } from "./features/downloader";
import { checkTwitterWorkerStatus } from "./features/posts/twitter/downloader/worker";
import { checkRedisConnection } from "./services/cache/redis";
import { connectDatabase } from "./services/database/connect";

async function bootstrap() {
  await connectDatabase();
  await checkRedisConnection();
  checkWorkerStatus();
  checkTwitterWorkerStatus();
  Bun.serve({ port: 3000, fetch: app.fetch });
  console.log("🚀 Server running at http://localhost:3000");
}

bootstrap().catch((err) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
