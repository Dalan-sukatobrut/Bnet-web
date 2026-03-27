import prisma from "../src/server/lib/prisma.js";

async function queryBandwidthDemandPhone() {
  try {
    const images = await prisma.image.findMany({
      where: {
        category: "layanan",
        OR: [
          {
            title: {
              contains: "Bandwidth",
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: "Demand",
              mode: "insensitive",
            },
          },
          {
            alt: {
              contains: "Bandwidth",
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: "Bandwidth",
              mode: "insensitive",
            },
          },
        ],
      },
    });

    console.log("Found layanan images with Bandwidth/Demand:");
    images.forEach((img) => {
      console.log(`ID: ${img.id}`);
      console.log(`Title: ${img.title}`);
      console.log(`Alt: ${img.alt}`);
      console.log(`Description: ${img.description}`);
      if (
        img.alt.match(/081[\d- ]{10,15}/) ||
        img.description.match(/081[\d- ]{10,15}/)
      ) {
        console.log(
          "📞 PHONE FOUND:",
          img.alt.match(/081[\d- ]{10,15}/)?.[0] ||
            img.description.match(/081[\d- ]{10,15}/)?.[0],
        );
      }
      console.log("---");
    });

    if (images.length === 0) {
      console.log("No matching images found.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

queryBandwidthDemandPhone();
