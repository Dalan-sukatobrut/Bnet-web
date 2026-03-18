import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fix2BeHomeFeatures() {
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

    const altText = features.join("\\n");

    const updated = await prisma.image.updateMany({
      where: {
        url: {
          contains: "layanan4.png",
        },
        category: "layanan",
        published: true,
      },
      data: {
        alt: altText,
        description:
          "Produk internet Fiber to the home untuk klien ritel dengan harga yang terjangkau dan kecepatan yang stabil.",
        updatedAt: new Date(),
      },
    });

    console.log("✅ Updated 2BeHome features alt:", updated.count, "records");

    // Verify
    const verify = await prisma.image.findFirst({
      where: {
        url: {
          contains: "layanan4.png",
        },
        category: "layanan",
      },
    });

    if (verify) {
      console.log("✅ Alt preview:", verify.alt.substring(0, 100) + "...");
      console.log(
        "✅ Features count expected:",
        verify.alt.split("\\n").length,
      );
    }

    console.log("✅ Fix complete - restart dev server if running");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fix2BeHomeFeatures().catch(console.error);
