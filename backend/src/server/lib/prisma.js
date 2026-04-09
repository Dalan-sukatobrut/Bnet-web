import { PrismaClient } from "@prisma/client";

const NODE_ENV = process.env.NODE_ENV || "development";

// Ensure singleton in dev (hot reload) and prod
let prisma;

if (NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["warn", "error"],
  });
} else {
  if (!globalThis.__PRISMA__) {
    globalThis.__PRISMA__ = new PrismaClient({
      log: ["warn", "error"], // disable 'query' logging to reduce noise
    });
  }
  prisma = globalThis.__PRISMA__;
}

export default prisma;
