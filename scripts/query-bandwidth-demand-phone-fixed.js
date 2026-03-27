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
            },
          },
          {
            title: {
              contains: "Demand",
            },
          },
          {
            alt: {
              contains: "Bandwidth",
            },
          },
          {
            description: {
              contains: "Bandwidth",
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
      const phoneMatch =
        img.alt.match(/081\\d{3,4}-?\\d{3,4}-?\\d{3,4}/) ||
        img.description.match(/081\\d{3,4}-?\\d{3,4}-?\\d{3,4}/);
      if (phoneMatch) {
        console.log("📞 PHONE FOUND:", phoneMatch[0]);
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
