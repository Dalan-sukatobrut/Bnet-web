import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function queryFourNetPhone() {
  try {
    console.log("🔍 Querying FourNet layanan images for old phone numbers...");

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
              contains: "layanan2.png",
            },
          },
          {
            url: {
              contains: "layanan3.png",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        url: true,
        description: true,
        alt: true,
      },
    });

    console.log(
      `\n📋 Found ${images.length} FourNet-related layanan images:\n`,
    );

    let foundOldPhone = false;
    images.forEach((img) => {
      console.log(`\n--- ${img.title} (URL: ${img.url}) ---`);
      console.log(`ID: ${img.id}`);
      console.log(`Description: ${img.description || "NULL"}`);

      // Check for old phone patterns
      const oldPhones = [
        "6281144400723",
        "0811-4440-0723",
        "08114440",
        "44400723",
      ];

      const descLower = (img.description || "").toLowerCase();
      const altLower = (img.alt || "").toLowerCase();

      oldPhones.forEach((phone) => {
        if (
          descLower.includes(phone.toLowerCase()) ||
          altLower.includes(phone.toLowerCase())
        ) {
          console.log(`🚨 OLD PHONE FOUND: ${phone}`);
          foundOldPhone = true;
        }
      });

      console.log(
        `Alt preview: "${img.alt ? img.alt.substring(0, 100) : "NULL"}..."`,
      );
    });

    if (!foundOldPhone) {
      console.log("\n✅ No old FourNet phone numbers found in DB!");
    } else {
      console.log("\n⚠️  Old phones detected - run fix script next!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

queryFourNetPhone().catch(console.error);
