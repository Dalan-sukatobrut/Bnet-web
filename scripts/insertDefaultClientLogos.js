/**
 * Script untuk menambahkan logo klien default ke database
 * Agar logo-logo ini bisa dikelola dari admin panel
 *
 * Cara menjalankan: node scripts/insertDefaultClientLogos.js
 *
 * @node
 */

import prisma from "../src/server/lib/prisma.js";

const DEFAULT_CLIENT_LOGOS = [
  {
    title: "Bosowa Bandar",
    url: "/images/clients/1.bosowa%20bandar.png",
    order: 1,
  },
  {
    title: "Bosowa Propertindo",
    url: "/images/clients/2.bosowa%20propertindo.png",
    order: 2,
  },
  {
    title: "Bosowa Berlian",
    url: "/images/clients/3.bosowa%20berlian.png",
    order: 3,
  },
  {
    title: "Bosowa Transportasi",
    url: "/images/clients/4.bosowa%20transportasi.png",
    order: 4,
  },
  {
    title: "Bosowa Asuransi",
    url: "/images/clients/5.bosowa%20asuransi.png",
    order: 5,
  },
  {
    title: "Bosowa Semen",
    url: "/images/clients/6.bosowa%20semen%20logo%20our%20client.png",
    order: 6,
  },
  {
    title: "Politeknik Bosowa",
    url: "/images/clients/7.politeknik%20bosowa.png",
    order: 7,
  },
  {
    title: "Kreasi Binar",
    url: "/images/clients/8.kreasi%20binar.png",
    order: 8,
  },
  {
    title: "BPS Provinsi",
    url: "/images/clients/9.bps%20provinsi.png",
    order: 9,
  },
  { title: "Politeknik", url: "/images/clients/10.politeknik.png", order: 10 },
  {
    title: "Kontak Perkasa",
    url: "/images/clients/11.kontak%20perkasa.png",
    order: 11,
  },
  { title: "BNI", url: "/images/clients/12.bni.png", order: 12 },
  {
    title: "BBVET Maros",
    url: "/images/clients/13.bbvet%20maros%20logo%20our%20client.png",
    order: 13,
  },
  {
    title: "Dimarco",
    url: "/images/clients/14.dimarco%20logo%20our%20client.png",
    order: 14,
  },
  { title: "BNS", url: "/images/clients/15.bns.png", order: 15 },
  { title: "Golden", url: "/images/clients/16.golden.jpg", order: 16 },
  {
    title: "DJP Pajak",
    url: "/images/clients/17.djp-pajak-logo%20our%20client.png",
    order: 17,
  },
  {
    title: "Bank Mandiri",
    url: "/images/clients/18.bank-mandiri%20logo%20our%20client.png",
    order: 18,
  },
  {
    title: "Bank Sulteng",
    url: "/images/clients/19.bank-sulteng-logo%20our%20client.png",
    order: 19,
  },
  { title: "Elit", url: "/images/clients/20.elit.png", order: 20 },
  {
    title: "Pengadilan Negeri",
    url: "/images/clients/21.pengadilan%20negri.png",
    order: 21,
  },
  {
    title: "SAS",
    url: "/images/clients/22.sas%20logo%20our%20client.png",
    order: 22,
  },
  {
    title: "Universitas Bosowa",
    url: "/images/clients/23.universitas%20bosowa.png",
    order: 23,
  },
];

async function insertDefaultClientLogos() {
  console.log("🚀 Memasukkan logo klien default ke database...\n");

  // Check existing logos
  const existingLogos = await prisma.image.findMany({
    where: { category: "klien" },
  });

  console.log(`📊 Logo klien existing di database: ${existingLogos.length}`);

  // Get URLs that already exist
  const existingUrls = existingLogos.map((l) => l.url);

  // Filter logos that need to be added
  const logosToAdd = DEFAULT_CLIENT_LOGOS.filter(
    (logo) => !existingUrls.includes(logo.url),
  );

  if (logosToAdd.length === 0) {
    console.log("✅ Semua logo klien sudah ada di database!");
    return;
  }

  console.log(`\n➕ Akan menambahkan ${logosToAdd.length} logo:`);

  for (const logo of logosToAdd) {
    try {
      const result = await prisma.image.create({
        data: {
          title: logo.title,
          description: "Logo klien default",
          url: logo.url,
          alt: logo.title,
          category: "klien",
          order: logo.order,
          published: true,
        },
      });
      console.log(`  ✅ ${logo.title}`);
    } catch (error) {
      console.error(`  ❌ Gagal ${logo.title}:`, error.message);
    }
  }

  console.log(
    "\n✅ Selesai! Logo klien sekarang bisa dikelola dari admin panel.",
  );
}

insertDefaultClientLogos()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
