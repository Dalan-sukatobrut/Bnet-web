const { PrismaClient } = require("@prisma/client");

async function fix2BeHomeLayanan() {
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
    ].join(", ");

    const updated = await prisma.image.updateMany({
      where: {
        url: {
          contains: "layanan4.png",
        },
        category: "layanan",
        published: true,
      },
      data: {
        alt: features,
        description:
          "Produk internet Fiber to the home untuk klien ritel dengan harga yang terjangkau dan kecepatan yang stabil.",
        updatedAt: new Date(),
      },
    });

    console.log("✅ Updated 2BeHome layanan image:", updated.count, "records");

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
      console.log("✅ Verified alt length:", verify.alt.length);
      console.log("✅ First 50 chars:", verify.alt.substring(0, 50) + "...");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fix2BeHomeLayanan().catch(console.error);
