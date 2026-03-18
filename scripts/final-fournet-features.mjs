import { PrismaClient } from "@prisma/client";

async function finalFourNetUpdate() {
  const prisma = new PrismaClient();

  try {
    const exactAlt = `Dedicated, symmetrical bandwidth||
99% SLA (7-hour monthly tolerance)||
24/7 NOC support||
Ultra-stable fiber backbone||
Suitable for offices, enterprises, financial services, and institutions`;

    const updated = await prisma.image.updateMany({
      where: {
        title: "FourNet",
        category: "layanan",
        published: true,
      },
      data: {
        alt: exactAlt,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Set exact FourNet alt: ${updated.count} records`);
    console.log(`Length: ${exactAlt.length} chars`);
    console.log("Preview:", exactAlt.substring(0, 60) + "...");

    // Verify split (frontend uses split(","))
    const verify = await prisma.image.findFirst({
      where: { title: "FourNet", category: "layanan" },
      select: { alt: true },
    });

    if (verify) {
      const features = verify.alt.split(",").map((f) => f.trim());
      console.log("\n✅ Frontend split by ',':", features);
      console.log("Count:", features.length);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

finalFourNetUpdate().catch(console.error);
