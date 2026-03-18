import { PrismaClient } from "@prisma/client";

async function cleanLayananAlt() {
  const prisma = new PrismaClient();

  try {
    console.log("🧹 Cleaning layanan alt texts...\n");

    const images = await prisma.image.findMany({
      where: {
        category: "layanan",
        published: true,
      },
      orderBy: { order: "asc" },
    });

    console.log(`📊 Found ${images.length} layanan images to clean:\n`);

    let updatedCount = 0;

    for (const img of images) {
      console.log(`Processing "${img.title}" (ID: ${img.id})`);

      // Current alt preview
      console.log(
        `  Before: "${img.alt.substring(0, 60)}${img.alt.length > 60 ? "..." : ""}"`,
      );

      // Clean logic: split by comma, trim, filter bad/empty, join back
      let features = img.alt
        ? img.alt
            .split(",")
            .map((f) => f.trim())
            .filter(
              (f) =>
                f &&
                f.length > 2 &&
                !/^\s*(ada|karena|tidak|belum|kosong|none|null)\s*$/i.test(f),
            )
        : [];

      const cleanAlt = features.join(", ");

      if (cleanAlt !== img.alt && features.length > 0) {
        await prisma.image.update({
          where: { id: img.id },
          data: { alt: cleanAlt },
        });
        console.log(
          `  ✅ UPDATED to: "${cleanAlt.substring(0, 60)}..." (${features.length} features)`,
        );
        updatedCount++;
      } else {
        console.log(`  ⏭️  No changes needed or empty features`);
      }
      console.log("");
    }

    console.log(`✅ Cleaning complete: ${updatedCount} images updated`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanLayananAlt().catch(console.error);
