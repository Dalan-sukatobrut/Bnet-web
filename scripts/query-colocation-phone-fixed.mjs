import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function queryColocation() {
  console.log("=== QUERY COLOCATION RECORDS ===");

  // Query Images with colocation (no mode for MySQL)
  const images = await prisma.image.findMany({
    where: {
      OR: [
        { title: { contains: "colocation" } },
        { description: { contains: "colocation" } },
        { title: { contains: "Colocation Server" } },
      ],
    },
  });

  console.log(
    "Colocation Images:",
    images.map((i) => ({
      id: i.id,
      title: i.title,
      category: i.category,
      desc: i.description || "no desc",
    })),
  );

  // Potential phones
  const phoneImages = await prisma.image.findMany({
    where: {
      OR: [
        { title: { contains: "0811" } },
        { description: { contains: "0811" } },
        { title: { contains: "4440" } },
        { description: { contains: "4440" } },
        { title: { contains: "0723" } },
        { description: { contains: "0723" } },
      ],
    },
  });
  console.log(
    "Potential phone images:",
    phoneImages.map((i) => ({
      id: i.id,
      title: i.title,
      category: i.category,
      desc: i.description || "no desc",
    })),
  );

  // All produk and layanan images
  const produk = await prisma.image.findMany({ where: { category: "produk" } });
  console.log(
    "Produk images count:",
    produk.length,
    "titles:",
    produk.map((p) => p.title),
  );

  const layanan = await prisma.image.findMany({
    where: { category: "layanan" },
  });
  console.log(
    "Layanan images count:",
    layanan.length,
    "titles:",
    layanan.map((p) => p.title),
  );

  console.log("=== END ===");
}

queryColocation()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
