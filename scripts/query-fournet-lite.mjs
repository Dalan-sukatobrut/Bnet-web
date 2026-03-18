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
              contains: "FourNet Lite",
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: "fournet lite",
              mode: "insensitive",
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
      },
    });

    console.log("\n📋 Found images:");
    images.forEach((img, idx) => {
      console.log(`\n--- Image ${idx + 1} ---`);
      console.log(`Title: ${img.title}`);
      console.log(`URL: ${img.url}`);
      console.log(`Alt (raw):`, img.alt);
      console.log(
        `Split features:`,
        img.alt ? img.alt.split(",").map((f) => f.trim()) : [],
      );
      console.log(`Alt length: ${img.alt?.length || 0}`);
    });

    if (images.length === 0) {
      console.log("\n❌ No matching FourNet Lite images found!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

queryFourNetLite().catch(console.error);
