/**
 * Script untuk membersihkan gambar homepage yang duplikat atau URL-nya salah
 *
 * Cara menjalankan: node scripts/cleanupHomepageImages.js
 *
 * @node
 */

import prisma from "../src/server/lib/prisma.js";

async function cleanupHomepageImages() {
  console.log("🚀 Memulai cleanup gambar homepage...\n");

  // Get all homepage images
  const allImages = await prisma.image.findMany({
    where: { category: "homepage" },
    orderBy: { order: "asc" },
  });

  console.log(`📊 Total gambar homepage di database: ${allImages.length}`);

  // Show all images before cleanup
  console.log("\n📋 Semua gambar homepage:");
  for (const img of allImages) {
    console.log(
      `  - ${img.title} (order: ${img.order}, published: ${img.published})`,
    );
    console.log(`    URL: ${img.url}`);
  }

  // Delete images with absolute URLs (http://localhost:3001/...)
  const imagesToDelete = allImages.filter(
    (img) => img.url.startsWith("http://") || img.url.startsWith("https://"),
  );

  console.log(
    `\n🗑️ Akan menghapus ${imagesToDelete.length} gambar dengan URL absolut:`,
  );
  for (const img of imagesToDelete) {
    console.log(`  - ${img.title}: ${img.url}`);
    await prisma.image.delete({ where: { id: img.id } });
    console.log(`    ✅ Deleted`);
  }

  // Get remaining images
  const remainingImages = await prisma.image.findMany({
    where: { category: "homepage" },
    orderBy: { order: "asc" },
  });

  console.log(`\n📊 Gambar tersisa: ${remainingImages.length}`);

  // Update order to be sequential (1, 2, 3, ...)
  console.log("\n📝 Mengupdate urutan gambar:");
  for (let i = 0; i < remainingImages.length; i++) {
    const img = remainingImages[i];
    const newOrder = i + 1;
    if (img.order !== newOrder) {
      await prisma.image.update({
        where: { id: img.id },
        data: { order: newOrder },
      });
      console.log(`  - ${img.title}: order ${img.order} -> ${newOrder}`);
    }
  }

  // Final check
  console.log("\n📋 Gambar homepage setelah cleanup:");
  const finalImages = await prisma.image.findMany({
    where: { category: "homepage" },
    orderBy: { order: "asc" },
  });

  for (const img of finalImages) {
    console.log(
      `  - ${img.title} (order: ${img.order}, published: ${img.published})`,
    );
    console.log(`    URL: ${img.url}`);
  }

  console.log("\n✅ Selesai! Gambar homepage sudah dibersihkan.");
}

cleanupHomepageImages()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
