import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NEW_PHONE = "0811-4430-2898";

async function fixFourNetPhone() {
  try {
    console.log("🔧 Updating ALL FourNet phone numbers in layanan images...");

    const images = await prisma.image.findMany({
      where: {
        category: "layanan",
        published: true,
        OR: [
          {
            title: {
              contains: "FourNet",
            },
          },
          {
            title: {
              contains: "fournet",
            },
          },
          {
            url: {
              contains: "layanan1.png",
            },
          },
          {
            url: {
              contains: "layanan4.png", // Assuming FourNet Lite etc.
            },
          },
        ],
      },
    });

    if (images.length === 0) {
      console.log("❌ No FourNet layanan images found!");
      return;
    }

    console.log(
      `📋 Found ${images.length} FourNet-related images to check/update.`,
    );

    const oldPhonePatterns = [
      "6281144400723",
      "0811-4440-0723",
      "08114440",
      "44400723",
      /0811[-\s]?4440[-\s]?0723/gi,
      /08114440/gi,
    ];

    let updatedCount = 0;

    for (const img of images) {
      let changed = false;
      let newAlt = img.alt || "";
      let newDesc = img.description || "";

      // Check and replace in alt and desc
      oldPhonePatterns.forEach((pattern) => {
        if (typeof pattern === "string") {
          if (newAlt.includes(pattern)) {
            newAlt = newAlt.replaceAll(pattern, NEW_PHONE);
            changed = true;
          }
          if (newDesc.includes(pattern)) {
            newDesc = newDesc.replaceAll(pattern, NEW_PHONE);
            changed = true;
          }
        } else {
          // Regex
          if (pattern.test(newAlt)) {
            newAlt = newAlt.replace(pattern, NEW_PHONE);
            changed = true;
          }
          if (pattern.test(newDesc)) {
            newDesc = newDesc.replace(pattern, NEW_PHONE);
            changed = true;
          }
        }
      });

      if (changed) {
        await prisma.image.update({
          where: { id: img.id },
          data: {
            alt: newAlt.trim(),
            description: newDesc.trim(),
            updatedAt: new Date(),
          },
        });
        updatedCount++;
        console.log(
          `✅ Updated ${img.title} (ID: ${img.id}): alt/desc now use ${NEW_PHONE}`,
        );
      } else {
        console.log(`ℹ️ No change needed for ${img.title} (ID: ${img.id})`);
      }
    }

    console.log(
      `\n🎉 Completed! Updated ${updatedCount} out of ${images.length} FourNet images.`,
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFourNetPhone().catch(console.error);
