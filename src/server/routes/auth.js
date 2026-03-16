import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie("access_token", { path: "/" });
}

function requireAuth(req, res, next) {
  try {
    // Cek cookie dulu, lalu fallback ke Authorization header
    let token = req.cookies?.access_token;

    // Jika tidak ada cookie, cek Authorization header (Bearer token)
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
}

// ===== MIDDLEWARE PROTEKSI =====
// Token khusus untuk akses login/register
const AUTH_PORTAL_TOKEN =
  process.env.AUTH_PORTAL_TOKEN || "bnet-secure-portal-key-2025";

const verifyPortalAccess = (req, res, next) => {
  const token = req.headers["x-portal-key"] || req.query.key;

  if (!token || token !== AUTH_PORTAL_TOKEN) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Portal access denied",
    });
  }

  next();
};

// REGISTER - Daftar akun baru
router.post("/register", verifyPortalAccess, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validasi input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Semua field harus diisi",
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof name !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Format input tidak valid" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password minimal 6 karakter",
      });
    }

    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email sudah terdaftar",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Response sukses
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error register:", error.message, error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// LOGIN - Masuk ke akun
router.post("/login", verifyPortalAccess, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email dan password harus diisi",
      });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Format input tidak valid" });
    }

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Samakan pesan untuk mencegah user enumeration
    const invalidMsg = "Email atau password salah";

    if (!user) {
      return res.status(401).json({ success: false, error: invalidMsg });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: invalidMsg });
    }

    // Login berhasil -> buat token & set HttpOnly cookie
    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: "Login berhasil!",
      token, // Kirim token juga ke frontend
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server",
    });
  }
});

// FORGOT PASSWORD - Request reset password
router.post("/forgot-password", verifyPortalAccess, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        error: "Email harus diisi",
      });
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Jangan kasih tahu kalau email tidak ditemukan (security)
      return res.json({
        success: true,
        message: "Jika email terdaftar, link reset password akan dikirim",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 jam

    // Simpan token ke database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Di production, kirim email dengan link reset
    // Untuk development, kita return token di response
    console.log(`[Forgot Password] Reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: "Link reset password telah dikirim ke email Anda",
      // Hanya untuk development/testing
      devInfo: {
        resetToken,
        resetUrl: `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`,
      },
    });
  } catch (error) {
    console.error("Error forgot password:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server",
    });
  }
});

// RESET PASSWORD - Reset password dengan token
router.post("/reset-password", verifyPortalAccess, async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({
        success: false,
        error: "Semua field harus diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password minimal 6 karakter",
      });
    }

    // Cari user dengan token yang valid
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Token tidak valid atau sudah expired",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password dan hapus token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({
      success: true,
      message: "Password berhasil direset",
    });
  } catch (error) {
    console.error("Error reset password:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server",
    });
  }
});

// GET /me - Verifikasi sesi dari cookie
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, error: "Terjadi kesalahan server" });
  }
});

// POST /logout - Hapus cookie
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logout berhasil" });
});

export default router;
