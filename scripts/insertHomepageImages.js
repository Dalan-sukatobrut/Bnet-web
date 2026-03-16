import prisma from "../src/server/lib/prisma.js";

/**
 * Script untuk memasukkan gambar homepage awal ke database
 * Jalankan: node scripts/insertHomepageImages.js
 */

async function insertHomepageImages() {
  try {
    console.log("🔄 Memasukkan gambar homepage ke database...");

    // Data gambar homepage yang tersedia di folder public/images/clients/
    const homepageImages = [
      {
        title: "Gedung BNetID - Hero Slider 1",
        description: "Tampilan utama gedung BNetID dengan background kota",
        url: "/images/clients/beranda.png",
        category: "homepage",
        alt: "Gedung BNetID dengan background kota",
        order: 0,
        published: true,
      },
      {
        title: "Layanan Internet - Hero Slider 2",
        description: "Visualisasi layanan internet BNetID",
        url: "/images/clients/layanan1.png",
        category: "homepage",
        alt: "Visualisasi layanan internet BNetID",
        order: 1,
        published: true,
      },
      {
        title: "Infrastruktur Jaringan - Hero Slider 3",
        description: "Infrastruktur jaringan modern BNetID",
        url: "/images/clients/layanan2.png",
        category: "homepage",
        alt: "Infrastruktur jaringan modern BNetID",
        order: 2,
        published: true,
      },
    ];

    // Insert gambar
    for (const img of homepageImages) {
      // Cek apakah sudah ada
      const existing = await prisma.image.findFirst({
        where: {
          category: img.category,
          title: img.title,
        },
      });

      if (!existing) {
        const result = await prisma.image.create({
          data: {
            title: img.title,
            description: img.description,
            url: `http://localhost:3001${img.url}`, // Tambahkan full URL
            category: img.category,
            alt: img.alt,
            order: img.order,
            published: img.published,
          },
        });
        console.log(
          `✅ Gambar "${img.title}" berhasil ditambahkan (ID: ${result.id})`,
        );
      } else {
        console.log(`⏭️ Gambar "${img.title}" sudah ada, skip`);
      }
    }

    // Tampilkan summary
    console.log("\n📊 Summary gambar homepage:");
    const homepageCount = await prisma.image.count({
      where: { category: "homepage" },
    });
    console.log(`Total gambar homepage: ${homepageCount}`);

    // Tampilkan semua gambar homepage
    const allImages = await prisma.image.findMany({
      where: { category: "homepage" },
      orderBy: { order: "asc" },
    });

    console.log("\n📸 Daftar gambar homepage:");
    allImages.forEach((img) => {
      console.log(
        `  [${img.order}] ${img.title} (${img.published ? "Aktif" : "Non-aktif"})`,
      );
    });

    console.log(
      "\n✨ Selesai! Anda sekarang bisa melihat gambar di Admin Panel",
    );
    console.log("📍 Akses: http://localhost:5173/admin/panel");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertHomepageImages();
