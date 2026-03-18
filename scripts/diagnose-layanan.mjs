import { PrismaClient } from "@prisma/client";

async function diagnoseLayanan() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Diagnosing layanan images...\n");

    const images = await prisma.image.findMany({
      where: {
        category: "layanan",
        published: true,
      },
      orderBy: { order: "asc" },
    });

    console.log(`📊 Found ${images.length} published layanan images:\n`);

    images.forEach((img, index) => {
      const featureCount = img.alt ? img.alt.split(",").length : 0;
      const titleMatch =
        img.title.toLowerCase().includes("2behome") ||
        img.title.toLowerCase().includes("2behome");

      console.log(`#${index + 1} [${img.order}] "${img.title}"`);
      console.log(`   URL: ${img.url}`);
      console.log(`   Features count: ${featureCount}`);
      console.log(
        `   Alt preview: "${img.alt ? img.alt.substring(0, 80) + (img.alt.length > 80 ? "..." : "") : "EMPTY"}"`,
      );
      console.log(`   2BeHome match: ${titleMatch ? "✅ YES" : "❌ no"}\n`);
    });

    // Focus on 2BeHome
    const twoBeHome = images.find(
      (img) =>
        img.title.toLowerCase().includes("2behome") ||
        img.url.includes("layanan4"),
    );

    if (twoBeHome) {
      console.log("\n🎯 2BeHome details:");
      console.log("ID:", twoBeHome.id);
      console.log("Title:", twoBeHome.title);
      console.log("Alt full:", twoBeHome.alt || "EMPTY");
      console.log(
        "Features array preview:",
        twoBeHome.alt
          ? twoBeHome.alt
              .split(",")
              .map((f) => f.trim())
              .slice(0, 3)
          : [],
      );
    } else {
      console.log("\n⚠️ No 2BeHome image found!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseLayanan().catch(console.error);
