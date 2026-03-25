import prisma from "../src/server/lib/prisma.js";

/**
 * Script untuk memasukkan SEMUA gambar (homepage, layanan, produk, klien) ke database
 * Menggunakan gambar yang sudah ada di folder public/images/clients/
 * Jalankan: node scripts/insertAllCategoryImages.js
 */

const BASE_URL = "http://localhost:3001";

const imagesData = {
  // HOMEPAGE - Hero Slider Images
  homepage: [
    {
      title: "Gedung BNetID - Hero Slider 1",
      description: "Tampilan utama gedung BNetID dengan background kota",
      url: `${BASE_URL}/images/clients/beranda.png`,
      alt: "Gedung BNetID dengan background kota",
      order: 0,
      published: true,
    },
    {
      title: "Layanan Internet - Hero Slider 2",
      description: "Visualisasi layanan internet BNetID",
      url: `${BASE_URL}/images/clients/layanan1.png`,
      alt: "Visualisasi layanan internet BNetID",
      order: 1,
      published: true,
    },
    {
      title: "Infrastruktur Jaringan - Hero Slider 3",
      description: "Infrastruktur jaringan modern BNetID",
      url: `${BASE_URL}/images/clients/layanan2.png`,
      alt: "Infrastruktur jaringan modern BNetID",
      order: 2,
      published: true,
    },
  ],

  // LAYANAN - Service Images
  layanan: [
    {
      title: "2BeHome",
      description:
        "Produk internet Fiber to the home untuk klien ritel dengan harga yang terjangkau dan kecepatan yang stabil. Fitur: Fiber to home, Unlimited quota, Free instalasi",
      url: `${BASE_URL}/images/clients/layanan4.png`,
      alt: "Fiber to home, Unlimited quota, Free instalasi",
      order: 0,
      published: true,
    },
    {
      title: "FourNet",
      description:
        "Layanan enterprise untuk solusi bisnis dengan kecepatan, performa internet stabil, SLA, dan dukungan teknis 24 jam. Fitur: Bandwidth sesuai permintaan, CIR Ratio 1:1, Service Level Agreement, IP Public & Support 24/7",
      url: `${BASE_URL}/images/clients/layanan1.png`,
      alt: "Bandwidth sesuai permintaan, CIR Ratio 1:1, SLA, IP Public & Support 24/7",
      order: 1,
      published: true,
    },
    {
      title: "FourNet Lite",
      description:
        "Layanan broadband untuk solusi bisnis small & middle dengan performa stabil dan dukungan teknis 24 jam. Fitur: Bandwidth sesuai permintaan, CIR Ratio 1:4, Service Level Agreement, Support 24 jam",
      url: `${BASE_URL}/images/clients/layanan2.png`,
      alt: "Bandwidth sesuai permintaan, CIR Ratio 1:4, SLA, Support 24 jam",
      order: 2,
      published: true,
    },
    {
      title: "Bandwidth On Demand",
      description:
        "Layanan internet harian untuk solusi event online/streaming dengan kapasitas tinggi dan performa stabil. Fitur: Bandwidth sesuai permintaan, CIR Ratio 1:1, IP Public, SLA 99% & Support 24 jam",
      url: `${BASE_URL}/images/clients/layanan3.png`,
      alt: "Bandwidth sesuai permintaan, CIR Ratio 1:1, IP Public, SLA 99% & Support 24 jam",
      order: 3,
      published: true,
    },
  ],

  // PRODUK - Product Images
  produk: [
    {
      title: "Microsoft 365",
      description:\n        "Microsoft 365 tersedia melalui BNet sebagai reseller, memberikan kemudahan akses layanan produktivitas dengan dukungan yang lebih optimal.",
      url: `${BASE_URL}/images/clients/microsoft 365 bg page.png`,
      alt: "Microsoft 365 - Productivity Cloud Solution",
      order: 0,
      published: true,
    },
    {
      title: "VPS",
      description:
        "Server virtual dengan performa tinggi dan resource dedicated.",
      url: `${BASE_URL}/images/clients/vps bg page.png`,
      alt: "VPS - Virtual Private Server",
      order: 1,
      published: true,
    },
    {
      title: "Colocation Server",
      description: "Titipkan server fisik Anda di data center kami yang aman.",
      url: `${BASE_URL}/images/clients/colocation server bg page.png`,
      alt: "Colocation Server - Data Center Infrastructure",
      order: 2,
      published: true,
    },
    {
      title: "celebeshost.id",
      description:
        "celebeshost.id adalah layanan penyedia web hosting, domain, VPS dan Colocation Server.",
      url: `${BASE_URL}/images/clients/celebeshost bg page.png`,
      alt: "celebeshost.id - Cloud Services",
      order: 3,
      published: true,
    },
  ],

  // KLIEN - Client Logos
  klien: [
    {
      name: "Bosowa Bandar",
      url: `${BASE_URL}/images/clients/1.bosowa%20bandar.png`,
    },
    {
      name: "Bosowa Propertindo",
      url: `${BASE_URL}/images/clients/2.bosowa propertindo.png`,
    },
    {
      name: "Bosowa Berlian",
      url: `${BASE_URL}/images/clients/3.bosowa berlian.png`,
    },
    {
      name: "Bosowa Transportasi",
      url: `${BASE_URL}/images/clients/4.bosowa transportasi.png`,
    },
    {
      name: "Bosowa Asuransi",
      url: `${BASE_URL}/images/clients/5.bosowa asuransi.png`,
    },
    {
      name: "Bosowa Semen",
      url: `${BASE_URL}/images/clients/6.bosowa semen logo our client.png`,
    },
    {
      name: "Politeknik Bosowa",
      url: `${BASE_URL}/images/clients/7.politeknik bosowa.png`,
    },
    {
      name: "Kreasi Binar",
      url: `${BASE_URL}/images/clients/8.kreasi binar.png`,
    },
    {
      name: "BPS Provinsi",
      url: `${BASE_URL}/images/clients/9.bps provinsi.png`,
    },
    { name: "Politeknik", url: `${BASE_URL}/images/clients/10.politeknik.png` },
    {
      name: "Kontak Perkasa",
      url: `${BASE_URL}/images/clients/11.kontak perkasa.png`,
    },
    { name: "BNI", url: `${BASE_URL}/images/clients/12.bni.png` },
    {
      name: "BBVET Maros",
      url: `${BASE_URL}/images/clients/13.bbvet maros logo our client.png`,
    },
    {
      name: "Dimarco",
      url: `${BASE_URL}/images/clients/14.dimarco logo our client.png`,
    },
    { name: "BNS", url: `${BASE_URL}/images/clients/15.bns.png` },
    { name: "Golden", url: `${BASE_URL}/images/clients/16.golden.jpg` },
    {
      name: "DJP Pajak",
      url: `${BASE_URL}/images/clients/17.djp-pajak-logo our client.png`,
    },
    {
      name: "Bank Mandiri",
      url: `${BASE_URL}/images/clients/18.bank-mandiri logo our client.png`,
    },
    {
      name: "Bank Sulteng",
      url: `${BASE_URL}/images/clients/19.bank-sulteng-logo our client.png`,
    },
    { name: "Elit", url: `${BASE_URL}/images/clients/20.elit.png` },
    {
      name: "Pengadilan Negeri",
      url: `${BASE_URL}/images/clients/21.pengadilan negri.png`,
    },
    {
      name: "SAS",
      url: `${BASE_URL}/images/clients/22.sas logo our client.png`,
    },
    {
      name: "Universitas Bosowa",
      url: `${BASE_URL}/images/clients/23.universitas bosowa.png`,
    },
  ].map((client, index) => ({
    title: client.name,
    description: `Logo klien ${client.name}`,
    url: client.url,
    alt: client.name,
    order: index,
    published: true,
  })),
};

async function insertAllImages() {
  try {
    console.log("🔄 Memasukkan SEMUA gambar ke database...\n");

    let totalInserted = 0;

    // Insert untuk setiap kategori
    for (const [category, images] of Object.entries(imagesData)) {
      console.log(`\n📁 Kategori: ${category.toUpperCase()}`);
      console.log("-----------------------------------");

      for (const img of images) {
        // Cek apakah sudah ada (berdasarkan title dan category)
        const existing = await prisma.image.findFirst({
          where: {
            category: category,
            title: img.title,
          },
        });

        if (!existing) {
          await prisma.image.create({
            data: {
              title: img.title,
              description: img.description || "",
              url: img.url,
              category: category,
              alt: img.alt || img.title,
              order: img.order,
              published: img.published,
            },
          });
          console.log(`  ✅ "${img.title}"`);
          totalInserted++;
        } else {
          console.log(`  ⏭️  "${img.title}" (sudah ada)`);
        }
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SUMMARY");
    console.log("=".repeat(50));

    for (const category of ["homepage", "layanan", "produk", "klien"]) {
      const count = await prisma.image.count({ where: { category } });
      const active = await prisma.image.count({
        where: { category, published: true },
      });
      console.log(`  ${category}: ${count} gambar (${active} aktif)`);
    }

    const total = await prisma.image.count();
    console.log(`\n  TOTAL: ${total} gambar`);
    console.log("=".repeat(50));

    console.log("\n✨ Selesai!");
    console.log("📍 Frontend: http://localhost:5173");
    console.log("📍 Admin Panel: http://localhost:5173/admin/panel");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertAllImages();
