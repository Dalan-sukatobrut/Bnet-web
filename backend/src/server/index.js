import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import {
  projectRoot,
  srcPublicPath,
  rootPublicPath,
  imagesPath,
  uploadsPath,
  ensureDirectoryExists,
} from "./lib/paths.js";
import authRoutes from "./routes/auth.js";
import imageRoutes from "./routes/images.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Debug: Log paths
console.log("[Server] projectRoot:", projectRoot);
console.log("[Server] srcPublicPath:", srcPublicPath);
console.log("[Server] rootPublicPath:", rootPublicPath);
console.log("[Server] imagesPath:", imagesPath);
console.log("[Server] uploadsPath:", uploadsPath);
console.log("[Server] imagesPath exists:", fs.existsSync(imagesPath));
console.log("[Server] uploadsPath exists:", fs.existsSync(uploadsPath));

// Ensure upload directory exists
ensureDirectoryExists(uploadsPath);

// List some files
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  console.log("[Server] Files in uploads:", files.length);
  console.log("[Server] Sample files:", files.slice(0, 3));
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-portal-key",
    );
    return res.sendStatus(200);
  }
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Request dari origin: ${origin}`);
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-portal-key"],
    credentials: false,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ========== STATIC FILE SERVING ==========
// Serve /images from public/images folder (for clients, etc)
// Using express.static directly without wildcard routes
// Express 5 handles 404 automatically for missing static files
app.use(
  "/images",
  express.static(imagesPath, {
    maxAge: "1d",
    etag: true,
    fallthrough: true,
  }),
);

// Serve /uploads from src/public/images/uploads (for database images)
app.use(
  "/uploads",
  express.static(uploadsPath, {
    maxAge: "1d",
    etag: true,
    fallthrough: true,
  }),
);

// Also serve /images/uploads from src/public/images/uploads (for database images)
// This handles URLs like /images/uploads/optimized-xxx.webp
app.use(
  "/images/uploads",
  express.static(uploadsPath, {
    maxAge: "1d",
    etag: true,
    fallthrough: true,
  }),
);

// ========== RATE LIMITING ==========
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// ========== ROUTES ==========
app.use("/api/admin-portal", authLimiter, authRoutes);
app.use("/api/images", imageRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!",
    env: NODE_ENV,
    database: "MySQL via Prisma + Laragon",
    imageEndpoints: {
      homepage: "GET /api/images/homepage",
      layanan: "GET /api/images/layanan",
      produk: "GET /api/images/produk",
      klien: "GET /api/images/klien",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Error]", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🗄️  Database: MySQL via Prisma`);
  console.log(`📁 Static files: ${imagesPath}`);
  console.log("=".repeat(60) + "\n");
});

export default app;
