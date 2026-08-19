import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_SITE_SETTINGS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding DropEarn database...");

  // 1. Seed System Settings
  for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: {
        key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
        type: "STRING",
        category: key.toLowerCase().includes("revenue") || key.toLowerCase().includes("withdrawal")
          ? "REVENUE"
          : key.toLowerCase().includes("ad")
          ? "ADS"
          : key.toLowerCase().includes("upload")
          ? "UPLOADS"
          : "PLATFORM",
      },
    });
  }
  console.log("✅ Site settings initialized.");

  // 2. Seed Default Admin User
  const adminEmail = "admin@dropearn.local";
  const passwordHash = await bcrypt.hash("AdminPass123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      displayName: "System Administrator",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      referralCode: "ADMIN001",
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email} (Role: ${adminUser.role})`);

  // 3. Seed Default Creator User
  const creatorEmail = "creator@dropearn.local";
  const creatorUser = await prisma.user.upsert({
    where: { email: creatorEmail },
    update: {},
    create: {
      email: creatorEmail,
      displayName: "Demo Creator",
      role: Role.USER,
      status: UserStatus.ACTIVE,
      referralCode: "CREATOR1",
    },
  });
  console.log(`✅ Creator user seeded: ${creatorUser.email} (Referral Code: ${creatorUser.referralCode})`);

  console.log("🚀 Database initialization complete! Pure database state established.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
