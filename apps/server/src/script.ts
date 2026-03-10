import { readdir, writeFile } from "fs/promises";
import { TiktokUserModel } from "./features/posts/tiktok/models/user";
import { connectDatabase } from "./services/database/connect";

await connectDatabase();
const existingAvatars = await readdir(
  "C:\\Repos-2\\bookmark\\manager\\apps\\server\\src\\data\\tiktok\\user",
);
const existingUsernames = existingAvatars.map((file) => file.replace(".jpg", ""));
const nonExistingUsers = await TiktokUserModel.find({
  username: { $nin: existingUsernames },
});
console.log("Non-existing users count:", nonExistingUsers.length);

// console.log(users);

for (const user of nonExistingUsers) {
  const username = user.username;

  const response = await fetch(`https://www.tiktok.com/@${username}`);
  const html = await response.text();

  const scriptMatch = html.match(
    /<script[^>]*id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/,
  );
  const script = scriptMatch ? scriptMatch[1] : "";
  writeFile(`./data/${username}.json`, script);

  const avatarLargerMatch = html.match(/"avatarLarger"\s*:\s*"([^"]+)"/);
  const url = avatarLargerMatch ? avatarLargerMatch[1] : undefined;
  if (!url) {
    console.error(`avatarLarger not found for user: ${username}`);
    continue;
  }

  const downloadFile = await fetch(url);
  const buffer = await downloadFile.arrayBuffer();
  await writeFile(`./data/${username}.jpg`, Buffer.from(buffer));
  console.log("Avatar downloaded successfully");
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find the script tag containing the JSON data
  //   const scriptMatch = html.match(
  //     /<script[^>]*id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/,
  //   );

  // Regex to directly find the value for "avatarLarger"

  //   const script = scriptMatch ? scriptMatch[1] : "";
  //   const json = JSON.parse(script);

  //   // Safely extract avatarLarger URL from the scraped JSON
  //   const avatarLarger =
  //     json?.["__DEFAULT_SCOPE__"]?.["webapp.user-detail"]?.userInfo?.user?.avatarLarger;

  //   if (!avatarLarger) {
  //     console.error(`avatarLarger not found for user: ${username}`);
  //     continue;
  //   }

  //   const url = avatarLarger;
  //   //   const url = json["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"]["user"]["avatarLarger"];

  //   const downloadFile = await fetch(url);
  //   const buffer = await downloadFile.arrayBuffer();
  //   await writeFile(`./data/${username}.jpg`, Buffer.from(buffer));
  //   console.log("Avatar downloaded successfully");
  //   await new Promise((resolve) => setTimeout(resolve, 300));
}

process.exit(1);
