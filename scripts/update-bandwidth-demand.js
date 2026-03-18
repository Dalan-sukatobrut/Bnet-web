import prisma from "../src/server/lib/prisma.js";

async function updateBandwidthDemand() {
  const imageId = "cmmctmnvq0006134nw2va0pdv";

  const newDesc =
    "Temporary daily-based bandwidth service for webinars, conferences, events.";

  const newAlt =
    "Temporary daily-based bandwidth service\\nFor webinars conferences online events\\nStable high-quality streaming\\nPay only bandwidth used\\nNo long-term subscription\\nFlexible capacity event scale";

  try {
    const updated = await prisma.image.update({
      where: { id: imageId },
      data: {
        description: newDesc,
        alt: newAlt,
      },
    });

    console.log("✅ Updated Bandwidth On Demand:");
    console.log("- ID:", updated.id);
    console.log("- Title:", updated.title);
    console.log(
      "- New Description:",
      updated.description.substring(0, 100) + "...",
    );
    console.log(
      "- New Alt/Features:",
      updated.alt.split("\\n").slice(0, 2).join(", ") + "...",
    );
    console.log("Database updated successfully!");
  } catch (error) {
    console.error("❌ Error updating:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateBandwidthDemand();
