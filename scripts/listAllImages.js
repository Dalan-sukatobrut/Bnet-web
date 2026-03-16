import prisma from "../src/server/lib/prisma.js";

/**
 * Script untuk melihat semua gambar di database
 * Jalankan: node scripts/listAllImages.js
 */

async function listAllImages() {
  try {
    console.log("📸 Semua Gambar di Database BNetID");
    console.log("=====================================\n");

    const categories = ["homepage", "layanan", "produk", "klien"];

    for (const category of categories) {
      console.log(`\n📁 Kategori: ${category.toUpperCase()}`);
      console.log("-----------------------------------");

      const images = await prisma.image.findMany({
        where: { category },
        orderBy: { order: "asc" },
      });

      if (images.length === 0) {
        console.log("  (Belum ada gambar)");
      } else {
        images.forEach((img, idx) => {
          const status = img.published ? "✅ Aktif" : "❌ Non-aktif";
          console.log(`  ${idx + 1}. [${img.order}] ${img.title}`);
          console.log(`     Status: ${status}`);
          console.log(`     URL: ${img.url}`);
          console.log(`     Alt: ${img.alt}`);
          console.log(`     ID: ${img.id}\n`);
        });
      }

      const activeCount = images.filter((i) => i.published).length;
      console.log(`  Total: ${images.length} | Aktif: ${activeCount}\n`);
    }

    // Summary
    const totalImages = await prisma.image.count();
    const activeImages = await prisma.image.count({
      where: { published: true },
    });

    console.log("\n📊 SUMMARY KESELURUHAN");
    console.log("======================");
    console.log(`Total Gambar: ${totalImages}`);
    console.log(`Gambar Aktif: ${activeImages}`);
    console.log(`Gambar Non-Aktif: ${totalImages - activeImages}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

listAllImages();
