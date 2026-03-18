import { PrismaClient } from "@prisma/client";

async function fix2BeHomeAlt() {
  const prisma = new PrismaClient();

  try {
    const features = [
      "Hotspot – Suitable for up to 4 devices",
      "Andalan – Up to 10 Mbps",
      "Jagoan – Up to 20 Mbps",
      "Mini Boost – Up to 30 Mbps",
      "Super Boost – Up to 50 Mbps",
      "Modem included while subscribed",
      "24/7 customer support",
      "No long-term contract required",
    ];

    const altText = features.join(", ");

    console.log("🔧 Fixing 2BeHome alt...");
    console.log("New alt preview:", altText.substring(0, 100) + "...");

    const updated = await prisma.image.updateMany({
      where: {
        title: "2BeHome",
        category: "layanan",
        published: true,
      },
      data: {
        alt: altText,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Updated 2BeHome layanan image:", updated.count, "records");

    // Verify
    const verify = await prisma.image.findFirst({
      where: {
        title: "2BeHome",
        category: "layanan",
      },
    });

    if (verify) {
      const featureCount = verify.alt.split(",").length;
      console.log("✅ Verified - New features count:", featureCount);
      console.log(
        "✅ New alt preview:",
        verify.alt.substring(0, 80) + (verify.alt.length > 80 ? "..." : ""),
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fix2BeHomeAlt().catch(console.error);
