import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateFourNetLite() {
  try {
    const newFeatures = [
      "Dedicated, symmetrical bandwidth",
      "99% SLA (7-hour monthly tolerance)",
      "24/7 NOC support",
      "Ultra-stable fiber backbone",
      "Suitable for offices, enterprises, financial services, and institutions",
    ]
      .map((f) => f.trim())
      .join(", ");

    const updated = await prisma.image.updateMany({
      where: {
        url: {
          contains: "layanan2.png", // Matches FourNet Lite image
        },
        category: "layanan",
        published: true,
      },
      data: {
        alt: newFeatures,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Updated FourNet Lite features: ${updated.count} records`);
    console.log(`✅ New alt length: ${newFeatures.length}`);
    console.log(`✅ Features preview: ${newFeatures.substring(0, 100)}...`);

    // Verify the update
    const verify = await prisma.image.findFirst({
      where: {
        url: {
          contains: "layanan2.png",
        },
        category: "layanan",
      },
      select: {
        title: true,
        alt: true,
        url: true,
      },
    });

    if (verify) {
      console.log("\n✅ Verification:");
      console.log(`Title: ${verify.title}`);
      console.log(`Image: ${verify.url}`);
      console.log(`Features count: ${verify.alt.split(",").length}`);
      console.log(
        "Split features:",
        verify.alt.split(",").map((f) => f.trim()),
      );
    } else {
      console.log("❌ No matching record found!");
    }
  } catch (error) {
    console.error("❌ Error updating FourNet Lite:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFourNetLite().catch(console.error);
