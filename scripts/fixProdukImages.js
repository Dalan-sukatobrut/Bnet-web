/**
 * Script untuk memperbaiki URL gambar produk di database
 * Mengubah URL absolut menjadi relatif
 *
 * Cara menjalankan: node scripts/fixProdukImages.js
 *
 * @node
 */

import prisma from "../src/server/lib/prisma.js";

async function fixProdukImages() {
  console.log("🔧 Memperbaiki URL gambar produk...\n");

  // Get all produk images
  const images = await prisma.image.findMany({
    where: { category: "produk" },
  });

  console.log(`Ditemukan ${images.length} gambar produk\n`);

  for (const img of images) {
    // Convert absolute URL to relative URL
    let newUrl = img.url;

    if (img.url.startsWith("http://localhost:3001/")) {
      newUrl = img.url.replace("http://localhost:3001/", "/");
    }

    // Also fix any spaces that weren't encoded
    if (newUrl.includes(" ") && !newUrl.includes("%20")) {
      newUrl = newUrl.split(" ").join("%20");
    }

    if (newUrl !== img.url) {
      console.log(`📌 ${img.title}`);
      console.log(`   Lama: ${img.url}`);
      console.log(`   Baru: ${newUrl}`);

      await prisma.image.update({
        where: { id: img.id },
        data: { url: newUrl },
      });
      console.log(`   ✅ Updated!\n`);
    } else {
      console.log(`📌 ${img.title} - URL sudah benar`);
    }
  }

  console.log("✅ Selesai!");
}

fixProdukImages()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
