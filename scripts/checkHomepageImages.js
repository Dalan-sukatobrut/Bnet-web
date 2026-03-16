/**
 * Script untuk melihat gambar homepage saat ini di database
 *
 * Cara menjalankan: node scripts/checkHomepageImages.js
 *
 * @node
 */

import prisma from "../src/server/lib/prisma.js";

async function checkHomepageImages() {
  console.log("📸 Checklist gambar homepage di database:\n");

  const images = await prisma.image.findMany({
    where: { category: "homepage" },
    orderBy: { order: "asc" },
  });

  console.log(`Total: ${images.length} gambar\n`);

  for (const img of images) {
    console.log(`📌 ${img.title}`);
    console.log(
      `   - Published: ${img.published ? "✅ Aktif" : "❌ Non-Aktif"}`,
    );
    console.log(`   - Urutan: ${img.order}`);
    console.log(`   - URL: ${img.url}`);
    console.log();
  }
}

checkHomepageImages()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
