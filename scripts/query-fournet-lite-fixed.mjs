import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function queryFourNetLite() {
  try {
    console.log("🔍 Querying FourNet Lite layanan images...");

    const images = await prisma.image.findMany({
      where: {
        category: "layanan",
        published: true,
        OR: [
          {
            url: {
              contains: "layanan2.png",
            },
          },
          {
            title: {
              contains: "FourNet",
            },
          },
          {
            title: {
              contains: "fournet",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        url: true,
        alt: true,
        description: true,
        order: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    console.log("\n📋 All layanan images matching FourNet:");
    images.forEach((img, idx) => {
      console.log(`\\n--- Image ${idx + 1} (order: ${img.order}) ---`);
      console.log(`ID: ${img.id}`);
      console.log(`Title: ${img.title}`);
      console.log(`URL: ${img.url}`);
      console.log(`Alt (raw): "${img.alt || "NULL"}"`);
      console.log(
        `Split features: [${
          img.alt
            ? img.alt
                .split(",")
                .map((f) => `'${f.trim()}'`)
                .join(", ")
            : "no alt"
        }]`,
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

queryFourNetLite();
