import { PrismaClient } from "@prisma/client";

async function fixFourNetNewline() {
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
      .join("\\n"); // Newline join - exactly as user showed "kek begini"

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

    console.log(`✅ Fixed FourNet with NEWLINES: ${updated.count} records`);
    console.log(`✅ FULL alt (${features.length} chars):`);
    console.log(features.split("\\\\n").join("\\n")); // Show pretty

    // Test frontend split (will be 1 item, but user wants newline format)
    const frontendSplit = features.split(",").map((f) => f.trim());
    console.log(
      `\n📱 Frontend split(','): ${frontendSplit.length} items (but newline preserved)`,
    );

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

fixFourNetNewline().catch(console.error);
