import { PrismaClient } from "@prisma/client";

async function fixFourNetAlt() {
  const prisma = new PrismaClient();

  try {
    const features = [
      "Dedicated, symmetrical bandwidth",
      "99% SLA (7-hour monthly tolerance)",
      "24/7 NOC support",
      "Ultra-stable fiber backbone",
      "Suitable for offices, enterprises, financial services, and institutions",
    ]
      .map((f) => f.trim())
      .join(", ");

    const updated = await prisma.image.updateMany({
      where: {
        url: { contains: "layanan1.png" },
        category: "layanan",
        published: true,
      },
      data: {
        alt: features,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Fixed FourNet alt: ${updated.count} records`);
    console.log(`✅ Features count: ${features.split(",").length}`);
    console.log(`✅ Alt preview: ${features.substring(0, 80)}...`);

    // Verify current data
    const verify = await prisma.image.findFirst({
      where: { url: { contains: "layanan1.png" }, category: "layanan" },
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

fixFourNetAlt().catch(console.error);
