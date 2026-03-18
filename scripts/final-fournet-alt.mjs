import { PrismaClient } from "@prisma/client";

async function finalFourNetAlt() {
  const prisma = new PrismaClient();

  try {
    const features = [
      "Dedicated bandwidth CIR 1:1",
      "99.9% SLA otomatis kompensasi",
      "24/7 NOC support prioritas",
      "Fiber optic backbone stabil",
      "Enterprise, finance, institusi",
      "Static IP + monitoring real-time",
    ]
      .map((f) => f.trim())
      .join(", ");

    const updated = await prisma.image.updateMany({
      where: {
        url: { contains: "layanan1.png" },
        category: "layanan",
      },
      data: {
        alt: features,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Final FourNet alt update: ${updated.count} records`);
    console.log(`✅ Features count: ${features.split(",").length}`);
    console.log(`✅ Alt length: ${features.length}`);
    console.log(`✅ Alt preview: ${features.substring(0, 100)}...`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

finalFourNetAlt().catch(console.error);
