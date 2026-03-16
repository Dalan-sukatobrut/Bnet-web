import prisma from "../src/server/lib/prisma.js";
(async () => {
  const imgs = await prisma.image.findMany({
    where: { category: "klien" },
    orderBy: { order: "asc" },
  });
  console.log(imgs);
  process.exit(0);
})();
