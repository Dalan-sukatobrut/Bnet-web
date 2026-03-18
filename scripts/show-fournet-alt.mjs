import { PrismaClient } from "@prisma/client";

async function showFourNetAlt() {
  const prisma = new PrismaClient();

  try {
    const fournet = await prisma.image.findFirst({
      where: {
        title: "FourNet",
        category: "layanan",
        published: true,
      },
      select: {
        id: true,
        title: true,
        alt: true,
        url: true,
      },
    });

    if (fournet) {
      console.log("🔍 FourNet FULL alt:");
      console.log(`ID: ${fournet.id}`);
      console.log(`Title: ${fournet.title}`);
      console.log(`URL: ${fournet.url}`);
      console.log(`FULL alt (${fournet.alt.length} chars):`);
      console.log(fournet.alt);
      console.log("\n📋 Split by ',':");
      console.log(fournet.alt.split(",").map((f) => f.trim()));
      console.log(`Count: ${fournet.alt.split(",").length}`);
    } else {
      console.log("❌ No FourNet found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

showFourNetAlt().catch(console.error);
