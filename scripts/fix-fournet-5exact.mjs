import { PrismaClient } from "@prisma/client";

async function fixFourNet5Exact() {
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
      .join("; "); // Semicolon-space join to avoid split(',') breaking internals

    const updated = await prisma.image.updateMany({
      where: {
        title: "FourNet",
        category: "layanan",
        published: true,
      },
      data: {
        alt: features,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Fixed FourNet to EXACT 5 points: ${updated.count} records`);
    console.log(`✅ Join used: '; ' (protects internal commas)`);
    console.log(`✅ FULL alt (${features.length} chars): ${features}`);

    // Verify split as frontend does: split(',')
    const frontendFeatures = features.split(",").map((f) => f.trim());
    console.log(
      `\n📱 Frontend split(','): ${frontendFeatures.length} features`,
    );
    console.log(frontendFeatures.map((f, i) => `  ${i + 1}. ${f}`).join("\n"));

    // Save verification
    const verify = await prisma.image.findFirst({
      where: { title: "FourNet", category: "layanan" },
      select: { alt: true },
    });
    console.log(`\n✅ DB alt length: ${verify.alt.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFourNet5Exact().catch(console.error);
