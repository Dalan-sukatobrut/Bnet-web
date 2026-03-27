import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function queryColocation() {
  console.log("=== QUERY COLOCATION RECORDS ===");

  // Query Images/Layanan with colocation
  const images = await prisma.image.findMany({
    where: {
      OR: [
        { title: { contains: "colocation", mode: "insensitive" } },
        { description: { contains: "colocation", mode: "insensitive" } },
        { title: { contains: "Colocation Server", mode: "insensitive" } },
      ],
    },
  });

  console.log(
    "Images:",
    images.map((i) => ({
      id: i.id,
      title: i.title,
      desc: i.description || "no desc",
    })),
  );

  // Query if Layanan model exists - adjust if not
  try {
    const layanan = await prisma.layanan.findMany({
      where: {
        OR: [
          { title: { contains: "colocation", mode: "insensitive" } },
          { description: { contains: "colocation", mode: "insensitive" } },
        ],
      },
    });
    console.log(
      "Layanan:",
      layanan.map((l) => ({
        id: l.id,
        title: l.title,
        desc: l.description || "no desc",
      })),
    );
  } catch (e) {
    console.log("No Layanan model");
  }

  // Search all phones in images
  const phoneImages = await prisma.image.findMany({
    where: {
      OR: [
        { title: { contains: "0811" } },
        { description: { contains: "0811" } },
        { title: { contains: "4440" } },
        { description: { contains: "4440" } },
      ],
    },
  });
  console.log(
    "Potential phone images:",
    phoneImages.map((i) => ({
      id: i.id,
      title: i.title,
      desc: i.description || "no desc",
    })),
  );
}

queryColocation()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
