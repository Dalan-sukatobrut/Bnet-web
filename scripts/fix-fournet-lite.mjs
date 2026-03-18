import { PrismaClient } from "@prisma/client";

async function fixFourNetLiteLayanan() {
  const prisma = new PrismaClient();

  try {
    const features = [
      "Bandwidth sesuai permintaan (10-100 Mbps)",
      "CIR Ratio 1:4 untuk performa stabil",
      "Service Level Agreement 98%",
      "Support teknis 24/7",
      "Modem/router gratis selama berlangganan",
      "Installation dalam 3-7 hari kerja",
      "Cocok untuk UKM, kantor kecil-menengah, klinik",
    ].join("\\n");

    const updated = await prisma.image.updateMany({
      where: {
        url: {
          contains: "layanan2.png", // FourNet Lite uses layanan2.png
        },
        category: "layanan",
        published: true,
      },
      data: {
        alt: features,
        updatedAt: new Date(),
      },
    });

    console.log(
      "✅ Updated FourNet Lite layanan image:",
      updated.count,
      "records",
    );

    // Verify
    const verify = await prisma.image.findFirst({
      where: {
        url: {
          contains: "layanan2.png",
        },
        category: "layanan",
      },
    });

    if (verify) {
      console.log("✅ Verified alt length:", verify.alt.length);
      console.log("✅ Features count:", verify.alt.split("\\\\n").length);
      console.log("✅ First feature:", verify.alt.split("\\\\n")[0]);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFourNetLiteLayanan().catch(console.error);
