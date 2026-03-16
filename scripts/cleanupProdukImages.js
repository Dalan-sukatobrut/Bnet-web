/**
 * Script untuk melihat dan membersihkan gambar produk di database
 *
 * Cara menjalankan: node scripts/cleanupProdukImages.js
 *
 * @node
 */

import prisma from "../src/server/lib/prisma.js";

async function cleanupProdukImages() {
  console.log("📸 Checklist gambar Produk di database:\n");

  const images = await prisma.image.findMany({
    where: { category: "produk" },
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

cleanupProdukImages()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
