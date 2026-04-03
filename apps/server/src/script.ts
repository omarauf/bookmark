// import path from "node:path";
// import cliProgress from "cli-progress";
// import { and, eq } from "drizzle-orm";
// import fs from "fs/promises";
// import { db } from "./core/db";
// import { s3Client } from "./core/s3";
// import { creators } from "./modules/creator/schema";

// const CHECKPOINT_FILE = path.join(process.cwd(), "src", "upload-checkpoint.json");
// const dataFolder = path.join(process.cwd(), "src", "data", "twitter", "user");

// const stats = {
//   s3Exists: 0,
//   uploaded: 0,
// };

// async function loadCheckpoint() {
//   try {
//     const data = await fs.readFile(CHECKPOINT_FILE, "utf8");
//     return JSON.parse(data).lastFile || null;
//   } catch {
//     return null;
//   }
// }
// async function saveCheckpoint(lastFile: string) {
//   await fs.writeFile(CHECKPOINT_FILE, JSON.stringify({ lastFile }, null, 2));
// }

// function addSuffix(filename: string, suffix: string) {
//   const ext = path.extname(filename);
//   const name = path.basename(filename, ext);
//   return `${name}${suffix}${ext}`;
// }

// const files = await fs.readdir(dataFolder);
// const totalCount = files.length;

// const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
// progress.start(totalCount, 0);

// let lastFile = await loadCheckpoint();

// /**
//  * Skip files until checkpoint
//  */
// let startIndex = 0;
// if (lastFile) {
//   const index = files.indexOf(lastFile);
//   if (index !== -1) {
//     startIndex = index + 1;
//     progress.update(startIndex);
//   }
// }

// process.on("SIGINT", async () => {
//   console.log("\nStopping safely...");
//   if (lastFile) await saveCheckpoint(lastFile);
//   progress.stop();
//   process.exit();
// });

// for (let i = startIndex; i < files.length; i++) {
//   const file = files[i];
//   if (!file) continue;

//   // const modifiedName = file;
//   // const modifiedName = addSuffix(file, "-0");
//   const username = path.basename(file, path.extname(file));

//   const creator = await db.query.creators.findFirst({
//     where: and(eq(creators.username, username), eq(creators.platform, "twitter")),
//   });

//   if (!creator) {
//     console.warn(`Creator not found for username: ${username}, skipping file: ${file}`);
//     lastFile = file;
//     progress.increment();
//     continue;
//   }

//   const key = `twitter/avatar/${creator.externalId}.jpg`;

//   const s3Exist = await s3Client.exists(key);
//   const filePath = path.join(dataFolder, file);

//   if (s3Exist) {
//     stats.s3Exists++;
//     lastFile = file;
//     progress.increment();
//     await fs.unlink(filePath).catch(() => {});
//     continue;
//   }

//   const buffer = await fs.readFile(filePath);

//   await s3Client.upload(key, buffer);

//   await fs.unlink(filePath).catch(() => {});

//   stats.uploaded++;
//   lastFile = file;

//   progress.increment();
// }

// if (lastFile) {
//   await saveCheckpoint(lastFile);
// }

// progress.stop();

// console.log("Finished:", stats);
