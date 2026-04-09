import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma.js";
import {
  uploadsPath,
  imagesPath,
  ensureDirectoryExists,
} from "../lib/paths.js";

const router = express.Router();

// Debug paths
console.log("[Images] uploadsPath:", uploadsPath);
console.log("[Images] uploadsPath exists:", fs.existsSync(uploadsPath));

// Ensure upload directory exists
ensureDirectoryExists(uploadsPath);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueFilename = `img-${timestamp}-${uniqueId.substring(0, 8)}${ext}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
const AUTH_TOKEN =
  process.env.AUTH_PORTAL_TOKEN || "bnet-secure-portal-key-2025";

// Helper: Check if file exists
const checkFileExists = (filename) => {
  // Decode URL-encoded characters (e.g., %20 -> space)
  const decodedFilename = decodeURIComponent(filename);

  // Check in uploads path first
  const uploadsFilePath = path.join(uploadsPath, decodedFilename);
  if (fs.existsSync(uploadsFilePath)) {
    return true;
  }

  // Also check in public/images/clients path (for static client images)
  const publicImagesPath = path.join(imagesPath, "clients", decodedFilename);
  if (fs.existsSync(publicImagesPath)) {
    return true;
  }

  // Check in public/images root for other images
  const rootImagesPath = path.join(imagesPath, decodedFilename);
  if (fs.existsSync(rootImagesPath)) {
    return true;
  }

  return false;
};

// Helper: Extract filename from URL
const getFilename = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1];
};

// Auth middleware
const adminAuth = (req, res, next) => {
  const portalKey = req.headers["x-portal-key"] || req.query.key;
  if (!portalKey || portalKey !== AUTH_TOKEN) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized: Admin access required" });
  }

  try {
    const token = req.cookies?.access_token;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// Lightweight auth - hanya cek portal key
const portalKeyAuth = (req, res, next) => {
  console.log("[portalKeyAuth] Headers:", req.headers);

  let portalKey = req.headers["x-portal-key"] || req.query.key;
  if (!portalKey && req.query.key) {
    portalKey = decodeURIComponent(req.query.key);
  }
  if (!portalKey && req.body && req.body.key) {
    portalKey = req.body.key;
  }

  console.log("[portalKeyAuth] Portal key:", portalKey);
  console.log("[portalKeyAuth] Expected:", AUTH_TOKEN);

  if (!portalKey || portalKey !== AUTH_TOKEN) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized: Portal key required" });
  }
  console.log("[portalKeyAuth] ACCEPTED");
  next();
};

// ========== POST - Upload gambar ==========
router.post("/", portalKeyAuth, upload.single("file"), async (req, res) => {
  console.log("[Images API] POST /upload called");

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const { category, title, description, alt, order, published } = req.body;

    if (!title || !category) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ success: false, message: "title dan category harus diisi" });
    }

    // Validasi category
    const validCategories = ["homepage", "layanan", "produk", "klien"];
    if (!validCategories.includes(category)) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "category harus: homepage, layanan, produk, atau klien",
      });
    }

    const originalFilename = req.file.filename;

    // Optimize image with sharp
    const optimizedFilename = `optimized-${Date.now()}-${uuidv4().substring(0, 8)}.webp`;
    const optimizedPath = path.join(uploadsPath, optimizedFilename);

    // Use relative URL path
    let finalImageUrl = `/images/uploads/${optimizedFilename}`;

    try {
      await sharp(req.file.path)
        .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(optimizedPath);

      // Delete original file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.log("[Images API] Image optimized:", optimizedFilename);
    } catch (sharpError) {
      console.error("Sharp error:", sharpError);
      // Use original if optimization fails
      finalImageUrl = `/images/uploads/${originalFilename}`;
    }

    // Simpan ke database
    const image = await prisma.image.create({
      data: {
        title,
        description: description || "",
        url: finalImageUrl,
        category,
        alt: alt || title,
        order: Number.isInteger(Number(order)) ? Number(order) : 0,
        published: published === "false" ? false : true,
      },
    });

    console.log("[Images API] Image created:", image.id);

    res.status(201).json({
      success: true,
      message: "Gambar berhasil diunggah",
      image,
      url: finalImageUrl,
    });
  } catch (error) {
    console.error("[Images API] Error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error("Error deleting file:", e);
      }
    }
    res.status(500).json({
      success: false,
      message: "Gagal mengunggah gambar",
      error: error.message,
    });
  }
});

// ========== POST - Direct insert ==========
router.post("/direct", adminAuth, async (req, res) => {
  try {
    const { title, description, url, category, alt, order, published } =
      req.body;

    if (!title || !url || !category) {
      return res.status(400).json({
        success: false,
        message: "title, url, dan category harus diisi",
      });
    }

    const validCategories = ["homepage", "layanan", "produk", "klien"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "category harus: homepage, layanan, produk, atau klien",
      });
    }

    // Ensure URL is relative path
    const imageUrl = url.startsWith("/") ? url : `/${url}`;

    const image = await prisma.image.create({
      data: {
        title,
        description: description || "",
        url: imageUrl,
        category,
        alt: alt || title,
        order: Number.isInteger(order) ? order : 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Gambar berhasil ditambahkan",
      image,
    });
  } catch (error) {
    console.error("[Images API] Error create:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create image",
      error: error.message,
    });
  }
});

// ========== GET - Ambil gambar berdasarkan kategori ==========
router.get("/:category", async (req, res) => {
  try {
    // Anti-cache headers
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const { category } = req.params;
    const { published } = req.query;

    console.log(
      "[Images API] GET /:category:",
      category,
      "published:",
      published,
    );

    if (!category || typeof category !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Kategori tidak valid" });
    }

    // Build Prisma query - Filter by category AND published
    // Default: return all images in category (regardless of published status)
    // If published=true is requested, ONLY return published=true images
    let whereClause = { category };

    // Force filter: if published=true is requested, ONLY return published=true
    if (published === "true") {
      whereClause = { category, published: true };
    } else if (published === "false") {
      whereClause = { category, published: false };
    }

    // Use findMany without any limits to get ALL matching images
    const images = await prisma.image.findMany({
      where: whereClause,
      orderBy: { order: "asc" },
    });

    console.log(
      "[Images API] Found images:",
      images.length,
      "with filter:",
      published,
    );

    // Check file existence and normalize URLs
    const imagesWithStatus = images.map((img) => {
      const filename = getFilename(img.url);
      const fileExists = filename ? checkFileExists(filename) : false;

      // Normalize URL to relative path
      let normalizedUrl = img.url;
      if (img.url.startsWith("http://") || img.url.startsWith("https://")) {
        try {
          const urlObj = new URL(img.url);
          normalizedUrl = urlObj.pathname;
        } catch {
          // keep as is
        }
      }

      return {
        ...img,
        url: normalizedUrl,
        fileExists,
      };
    });

    // Log missing files
    imagesWithStatus.forEach((img) => {
      if (!img.fileExists) {
        console.warn(`[Images API] File not found: ${img.url}`);
      }
    });

    res.json({
      success: true,
      category,
      count: images.length,
      images: imagesWithStatus,
    });
  } catch (error) {
    console.error("[Images API] Error get images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
});

// ========== GET - Detail gambar ==========
router.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await prisma.image.findUnique({ where: { id } });

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.json({ success: true, image });
  } catch (error) {
    console.error("[Images API] Error get detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch image",
      error: error.message,
    });
  }
});

// ========== PUT - Update gambar ==========
router.put("/:id", portalKeyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, category, alt, order, published } =
      req.body;

    const existingImage = await prisma.image.findUnique({ where: { id } });
    if (!existingImage) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(url && { url }),
        ...(category && { category }),
        ...(alt && { alt }),
        ...(order !== undefined && { order: Number(order) }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    res.json({
      success: true,
      message: "Gambar berhasil diupdate",
      image: updatedImage,
    });
  } catch (error) {
    console.error("[Images API] Error update:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update image",
      error: error.message,
    });
  }
});

// ========== DELETE - Hapus gambar ==========
router.delete("/:id", portalKeyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const image = await prisma.image.findUnique({ where: { id } });

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    // Delete physical file
    try {
      const filename = getFilename(image.url);
      if (filename) {
        const filePath = path.join(uploadsPath, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("[Images API] File deleted:", filename);
        }
      }
    } catch (fileError) {
      console.error("[Images API] Error deleting file:", fileError);
    }

    await prisma.image.delete({ where: { id } });
    res.json({ success: true, message: "Gambar berhasil dihapus" });
  } catch (error) {
    console.error("[Images API] Error delete:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
});

// ========== DELETE - Hapus semua gambar dalam kategori ==========
router.delete("/category/:category", adminAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const result = await prisma.image.deleteMany({ where: { category } });
    res.json({
      success: true,
      message: `${result.count} gambar berhasil dihapus`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("[Images API] Error delete category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete images",
      error: error.message,
    });
  }
});

export default router;
