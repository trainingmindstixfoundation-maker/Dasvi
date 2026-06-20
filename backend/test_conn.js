const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to PostgreSQL...");
    const adminCount = await prisma.admin.count();
    const classCount = await prisma.class.count();
    const mediumCount = await prisma.medium.count();
    const subjectCount = await prisma.subject.count();
    const videoCount = await prisma.video.count();

    console.log("Connection successful!");
    console.log({
      adminCount,
      classCount,
      mediumCount,
      subjectCount,
      videoCount
    });

    if (adminCount > 0) {
      const admins = await prisma.admin.findMany();
      console.log("Admins:", admins.map(a => ({ id: a.id, email: a.email })));
    }
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
