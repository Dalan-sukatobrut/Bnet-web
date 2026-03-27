import prisma from "../src/server/lib/prisma.js";

const imageId = "cmmctmnvq0006134nw2va0pdv";

async function fixBandwidthDemandPhone() {
  try {
    // Current alt from previous
    const currentAlt =
      "Bandwidth sesuai permintaan (10Mbps-10Gbps),CIR Ratio 1:1 dedicated,IP Public Statik,SLA Uptime 99%,Support 24/7,Setup cepat event,Fleksibel harian/mingguan,Kapasitas tinggi streaming";

    const newAlt =
      currentAlt + ",Kontak Layanan Bandwidth On Demand: 0811-4430-2898";

    const updated = await prisma.image.update({
      where: { id: imageId },
      data: {
        alt: newAlt,
      },
    });

    console.log("✅ SUCCESS! Updated Bandwidth On Demand phone:");
    console.log("- ID:", updated.id);
    console.log("- Title:", updated.title);
    console.log("- New alt preview:", updated.alt.slice(-50));
    console.log("Phone added successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixBandwidthDemandPhone();
