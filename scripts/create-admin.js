import prisma from "../src/server/lib/prisma.js";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  try {
    console.log("🔄 Connecting to database...");

    // Delete ALL existing users
    console.log("🗑️  Deleting all existing users...");
    await prisma.user.deleteMany({});
    console.log("✅ All users deleted");

    // Hash the password
    const hashedPassword = await bcrypt.hash("17028B", 10);
    console.log("🔐 Password hashed");

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: "AdminBNetID@gmail.com",
        password: hashedPassword,
        name: "Admin",
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password: 17028B");
    console.log("👤 Role:", admin.role);
    console.log("🆔 ID:", admin.id);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
