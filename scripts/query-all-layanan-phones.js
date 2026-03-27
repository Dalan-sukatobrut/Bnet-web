import prisma from "../src/server/lib/prisma.js";

async function queryAllLayananPhones() {
  try {
    const images = await prisma.image.findMany({
      where: { category: "layanan" },
    });

    console.log(`Found ${images.length} layanan images:`);
    images.forEach((img) => {
      console.log(`Title: ${img.title}`);
      console.log(`ID: ${img.id}`);
      const phoneMatchAlt = img.alt.match(
        /081\\d{3,4}[- ]?\\d{3,4}[- ]?\\d{3,4}/g,
      );
      const phoneMatchDesc = img.description.match(
        /081\\d{3,4}[- ]?\\d{3,4}[- ]?\\d{3,4}/g,
      );
      if (phoneMatchAlt || phoneMatchDesc) {
        console.log("📞 Phones in alt:", phoneMatchAlt?.join(", ") || "none");
        console.log("📞 Phones in desc:", phoneMatchDesc?.join(", ") || "none");
      }
      console.log("---");
    });
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

queryAllLayananPhones();
