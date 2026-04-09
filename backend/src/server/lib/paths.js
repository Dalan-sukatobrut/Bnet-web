/**
 * Shared path utilities for the server
 * Ensures consistent path resolution across all server files
 */
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server directory: src/server (go up 1 level from src/server/lib)
const serverDir = path.resolve(__dirname, "..");

// Project root: C:\Users\Lenovo\BNetid (go up 4 levels from backend/src/server/lib)
// lib → server → src → backend → BNetid
const projectRoot = path.resolve(__dirname, "../../../..");

// Public directories
const srcPublicPath = path.join(projectRoot, "src", "public");
const rootPublicPath = path.join(projectRoot, "public");

// Image paths
const imagesPath = path.join(rootPublicPath, "images");
const uploadsPath = path.join(srcPublicPath, "images", "uploads");

/**
 * Ensure directory exists, create if not
 * @param {string} dirPath - Directory path to check/create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[Paths] Created directory: ${dirPath}`);
    return true;
  }
  return false;
}

// Ensure upload directory exists on module load
ensureDirectoryExists(uploadsPath);

// Export all paths
export {
  serverDir,
  projectRoot,
  srcPublicPath,
  rootPublicPath,
  imagesPath,
  uploadsPath,
  ensureDirectoryExists,
};

// Debug: Log paths when imported
console.log("[Paths] Server directory:", serverDir);
console.log("[Paths] Project root:", projectRoot);
console.log("[Paths] src/public:", srcPublicPath);
console.log("[Paths] public:", rootPublicPath);
console.log("[Paths] images (public):", imagesPath);
console.log("[Paths] uploads (src/public):", uploadsPath);
