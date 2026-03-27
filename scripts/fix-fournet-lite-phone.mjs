import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NEW_PHONE = "0811-4430-2898";

async function fixFourNetLitePhone() {
  try {
    console.log("🔧 Updating FourNet Lite phone number in layanan...");

    // Target specific FourNet Lite record
    const targetImage = await prisma.image.findFirst({
      where: {
        title: {
          contains: "FourNet Lite",
        },
        category: "layanan",
        published: true,
      },
    });

    if (!targetImage) {
      console.log("❌ No FourNet Lite image found!");
      return;
    }

    console.log(`📱 Found: ${targetImage.title} (ID: ${targetImage.id})`);
    console.log(`Current alt: "${targetImage.alt || "NULL"}"`);

    // Check if phone already present
    const oldPhoneRegex = /\b0811-4440-0723\b|\b08114440\b/g;
    let newAlt = targetImage.alt || "";

    if (oldPhoneRegex.test(newAlt)) {
      console.log("🔄 Replacing old phone...");
      newAlt = newAlt.replace(oldPhoneRegex, NEW_PHONE);
    } else {
      // Append if not present
      console.log("➕ Appending new phone to features...");
      newAlt += `, Kontak Layanan FourNet Lite: ${NEW_PHONE}`;
    }

    const updated = await prisma.image.update({
      where: { id: targetImage.id },
      data: {
        alt: newAlt.trim(),
        description:
          targetImage.description?.replace(oldPhoneRegex, NEW_PHONE) ||
          `Kontak: ${NEW_PHONE}`,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Successfully updated FourNet Lite record!");
    console.log(`New alt length: ${updated.alt.length}`);
    console.log(`Preview: ${updated.alt.substring(0, 100)}...`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFourNetLitePhone().catch(console.error);
