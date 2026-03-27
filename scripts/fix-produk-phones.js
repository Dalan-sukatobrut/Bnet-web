import prisma from "../src/server/lib/prisma.js";

async function fixProdukPhones() {
  console.log("=== FIX PRODUK PHONES: Microsoft 365, VPS, Colocation ===");

  const targetProducts = ["Microsoft 365", "VPS", "Colocation Server"];
  let updatedCount = 0;

  for (const title of targetProducts) {
    const images = await prisma.image.findMany({
      where: {
        category: "produk",
        title: { contains: title },
      },
    });

    console.log(`\\n--- ${title} ---`);
    console.log(`${images.length} records found`);

    for (const img of images) {
      let hasChange = false;
      let newDesc = img.description || "";
      let newAlt = img.alt || "";

      // Replace phone patterns (old numbers)
      const oldPhones = [
        "6281144400723",
        "0811 4440 0721",
        "0811-4440-0723",
        "081144400723",
      ];
      const newPhone = "0811-4430-2898";

      oldPhones.forEach((old) => {
        if (newDesc.includes(old)) {
          newDesc = newDesc.replaceAll(old, newPhone);
          hasChange = true;
          console.log(`Updated desc: ${old} -> ${newPhone}`);
        }
        if (newAlt.includes(old)) {
          newAlt = newAlt.replaceAll(old, newPhone);
          hasChange = true;
          console.log(`Updated alt: ${old} -> ${newPhone}`);
        }
      });

      if (hasChange) {
        await prisma.image.update({
          where: { id: img.id },
          data: {
            description: newDesc,
            alt: newAlt,
          },
        });
        updatedCount++;
        console.log(`✓ Updated ${img.id}`);
      } else {
        console.log(`  No phone changes needed for ${img.id}`);
      }
    }
  }

  console.log(`\\n=== SUMMARY: Updated ${updatedCount} records ===`);
}

fixProdukPhones()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
