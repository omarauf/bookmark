import { eq } from "drizzle-orm";
import { env } from "@/config/env";
import { db } from "../db";
import { auth } from "./lib";
import { users } from "./schema";

export async function seedAdmin() {
  const email = env.SUPER_ADMIN_EMAIL;

  const [exists] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (exists) {
    if (exists.emailVerified === false) {
      await db.update(users).set({ emailVerified: true }).where(eq(users.email, email));
    }

    console.log("User already exists");
    return;
  }

  await auth.api.signUpEmail({
    body: {
      email: email,
      password: env.SUPER_ADMIN_PASSWORD,
      name: "Super Admin",
    },
  });

  await db.update(users).set({ emailVerified: true }).where(eq(users.email, email));
}
