import prisma from "../src/server/lib/prisma.js";

async function fixBandwidthDemand() {
  try {
    // Cari image dengan title mengandung "Bandwidth" dan category "layanan"
    const images = await prisma.image.findMany({
      where: {
        title: {
          contains: "Bandwidth",
        },
        category: "layanan",
      },
    });

    if (images.length === 0) {
      console.log("❌ No Bandwidth image found in layanan category");
      return;
    }

    const targetImage =
      images.find((img) => img.title.toLowerCase().includes("demand")) ||
      images[0];
    console.log("🎯 Found image:", targetImage.title, targetImage.id);

    // Update dengan features yang proper comma-separated
    const newAlt =
      "Bandwidth sesuai permintaan (10Mbps-10Gbps),CIR Ratio 1:1 dedicated,IP Public Statik,SLA Uptime 99%,Support 24/7,Setup cepat event,Fleksibel harian/mingguan,Kapasitas tinggi streaming";

    const updated = await prisma.image.update({
      where: { id: targetImage.id },
      data: {
        alt: newAlt,
        description:
          "Layanan internet harian untuk solusi event online/streaming dengan kapasitas tinggi dan performa stabil.",
      },
    });

    console.log("✅ SUCCESS! Updated:");
    console.log("- Title:", updated.title);
    console.log("- Features count:", updated.alt.split(",").length);
    console.log(
      "- New alt preview:",
      updated.alt.split(",").slice(0, 3).join("; ") + "...",
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixBandwidthDemand();
