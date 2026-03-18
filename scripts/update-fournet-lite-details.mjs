import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateFourNetLiteDetails() {
  try {
    // Core 4 features only, remove suitability points
    const coreFeatures = [
      "Bandwidth sesuai permintaan (10-100 Mbps)",
      "CIR Ratio 1:4 untuk performa stabil",
      "Service Level Agreement 98%",
      "Support teknis 24/7",
    ].join(", ");

    const updated = await prisma.image.updateMany({
      where: {
        category: "layanan",
        published: true,
        url: {
          contains: "layanan2.png",
        },
      },
      data: {
        alt: coreFeatures,
        updatedAt: new Date(),
      },
    });

    console.log(
      `✅ Updated FourNet Lite detail paket: ${updated.count} records`,
    );
    console.log(`✅ New alt: ${coreFeatures}`);
    console.log(
      `✅ Features (${coreFeatures.split(",").length}):`,
      coreFeatures.split(",").map((f) => f.trim()),
    );

    // Verify
    const verify = await prisma.image.findFirst({
      where: {
        category: "layanan",
        url: {
          contains: "layanan2.png",
        },
      },
      select: {
        title: true,
        alt: true,
        url: true,
      },
    });

    if (verify) {
      console.log("\n✅ VERIFIED:");
      console.log(`Title: ${verify.title}`);
      console.log(
        `New features:`,
        verify.alt.split(",").map((f) => f.trim()),
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFourNetLiteDetails().catch(console.error);
