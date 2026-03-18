import { PrismaClient } from "@prisma/client";

async function fixFourNetLiteAlt() {
  const prisma = new PrismaClient();

  try {
    const features = [
      "Bandwidth sesuai permintaan (10-100 Mbps)",
      "CIR Ratio 1:4 untuk performa stabil",
      "Service Level Agreement 98%",
      "Support teknis 24/7",
      "Modem/router gratis selama berlangganan",
      "Installation dalam 3-7 hari kerja",
      ,
    ]
      .map((f) => f.trim())
      .join(", ");

    const updated = await prisma.image.updateMany({
      where: {
        url: { contains: "layanan2.png" },
        category: "layanan",
        published: true,
      },
      data: {
        alt: features,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Fixed FourNet Lite alt: ${updated.count} records`);
    console.log(`✅ Features count: ${features.split(",").length}`);
    console.log(`✅ Alt preview: ${features.substring(0, 80)}...`);

    // Verify current data
    const verify = await prisma.image.findFirst({
      where: { url: { contains: "layanan2.png" }, category: "layanan" },
      select: { title: true, alt: true },
    });

    if (verify) {
      console.log("✅ Current alt length:", verify.alt.length);
      console.log(
        "✅ Features after split:",
        verify.alt.split(",").map((f) => f.trim()).length,
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFourNetLiteAlt().catch(console.error);
