import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const emailOrUid = process.argv[2];
  const targetRole = (process.argv[3] || "ADMIN").toUpperCase();

  if (!emailOrUid) {
    console.error("❌ Please provide a user email or Firebase UID.");
    console.log("Usage: npm run make-admin <email> [ADMIN|USER]");
    console.log("Example: npm run make-admin mujahid@example.com ADMIN");
    process.exit(1);
  }

  if (targetRole !== "ADMIN" && targetRole !== "USER") {
    console.error("❌ Invalid role. Role must be 'ADMIN' or 'USER'.");
    process.exit(1);
  }

  console.log(`🔍 Searching for user "${emailOrUid}"...`);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: emailOrUid, mode: "insensitive" } },
        { firebaseUid: emailOrUid },
        { id: emailOrUid },
      ],
    },
  });

  if (!user) {
    console.error(`❌ No user found matching "${emailOrUid}". Make sure the user has signed up / logged in first.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: targetRole as any },
  });

  console.log("=================================================");
  console.log(`✅ SUCCESS: User role updated!`);
  console.log(`👤 Name:   ${updated.displayName || "No Name"}`);
  console.log(`📧 Email:  ${updated.email}`);
  console.log(`🔑 Role:   ${updated.role}`);
  console.log(`🆔 ID:     ${updated.id}`);
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error("❌ Error updating user role:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
