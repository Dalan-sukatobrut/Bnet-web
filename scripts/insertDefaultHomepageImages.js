/**
 * Script untuk menambahkan 3 gambar default homepage ke database
 * Ini agar gambar-gambar default bisa dikelola dari admin panel
 *
 * Cara menjalankan: node scripts/insertDefaultHomepageImages.js
 *
 * @node
 */

import prisma from "../src/server/lib/prisma.js";
import path from "path";
import fs from "fs";

const DEFAULT_HOMEPAGE_IMAGES = [
  {
    title: "Beranda",
    description: "Gambar default homepage - Beranda",
    url: "/images/clients/beranda.png",
    alt: "Beranda",
    category: "homepage",
    order: 1,
    published: true,
  },
  {
    title: "Layanan 1",
    description: "Gambar default homepage - Layanan 1",
    url: "/images/clients/layanan1.png",
    alt: "Layanan 1",
    category: "homepage",
    order: 2,
    published: true,
  },
  {
    title: "Layanan 2",
    description: "Gambar default homepage - Layanan 2",
    url: "/images/clients/layanan2.png",
    alt: "Layanan 2",
    category: "homepage",
    order: 3,
    published: true,
  },
];

async function insertDefaultImages() {
  console.log("🚀 Memulai insert gambar default homepage...\n");

  // Check if images already exist in database
  const existingImages = await prisma.image.findMany({
    where: {
      category: "homepage",
      url: {
        in: DEFAULT_HOMEPAGE_IMAGES.map((img) => img.url),
      },
    },
  });

  console.log(`📊 Gambar existing di database: ${existingImages.length}`);

  // Filter out images that already exist
  const imagesToInsert = DEFAULT_HOMEPAGE_IMAGES.filter(
    (img) => !existingImages.some((existing) => existing.url === img.url),
  );

  if (imagesToInsert.length === 0) {
    console.log("✅ Semua gambar default sudah ada di database!");

    // Show existing images
    console.log("\n📋 Gambar homepage yang ada di database:");
    for (const img of existingImages) {
      console.log(
        `  - ${img.title} (order: ${img.order}, published: ${img.published})`,
      );
    }
    return;
  }

  console.log(`\n➕ Akan menambahkan ${imagesToInsert.length} gambar baru:`);
  for (const img of imagesToInsert) {
    console.log(`  - ${img.title}: ${img.url}`);
  }

  // Insert new images
  for (const imgData of imagesToInsert) {
    try {
      // Check if file exists in public folder
      const filePath = path.join(process.cwd(), "public", imgData.url);
      const fileExists = fs.existsSync(filePath);

      console.log(`\n📁 Checking file: ${imgData.url}`);
      console.log(`   Path: ${filePath}`);
      console.log(`   Exists: ${fileExists}`);

      const image = await prisma.image.create({
        data: {
          title: imgData.title,
          description: imgData.description,
          url: imgData.url,
          alt: imgData.alt,
          category: imgData.category,
          order: imgData.order,
          published: imgData.published,
        },
      });

      console.log(
        `   ✅ Berhasil ditambahkan: ${image.title} (ID: ${image.id})`,
      );
    } catch (error) {
      console.error(`   ❌ Gagal menambahkan ${imgData.title}:`, error.message);
    }
  }

  // Final check
  console.log("\n📋 Semua gambar homepage di database:");
  const allHomepageImages = await prisma.image.findMany({
    where: { category: "homepage" },
    orderBy: { order: "asc" },
  });

  for (const img of allHomepageImages) {
    console.log(
      `  - ${img.title} (order: ${img.order}, published: ${img.published}, url: ${img.url})`,
    );
  }

  console.log(
    "\n✅ Selesai! Gambar default homepage sekarang bisa dikelola dari admin panel.",
  );
}

insertDefaultImages()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
