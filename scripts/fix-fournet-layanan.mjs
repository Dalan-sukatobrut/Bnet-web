import { PrismaClient } from "@prisma/client";

async function fixFourNetLayanan() {
  const prisma = new PrismaClient();

  try {
    const features = [
      "Dedicated, symmetrical bandwidth",
      "99% SLA (7-hour monthly tolerance)",
      "24/7 NOC support",
      "Ultra-stable fiber backbone",
      "Suitable for offices, enterprises, financial services, and institutions",
    ].join("\\n");

    const updated = await prisma.image.updateMany({
      where: {
        url: {
          contains: "layanan1.png", // FourNet uses layanan1.png
        },
        category: "layanan",
        published: true,
      },
      data: {
        alt: features,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Updated FourNet layanan image:", updated.count, "records");

    // Verify
    const verify = await prisma.image.findFirst({
      where: {
        url: {
          contains: "layanan1.png",
        },
        category: "layanan",
      },
    });

    if (verify) {
      console.log("✅ Verified alt length:", verify.alt.length);
      console.log("✅ First 50 chars:", verify.alt.substring(0, 50) + "...");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFourNetLayanan().catch(console.error);
