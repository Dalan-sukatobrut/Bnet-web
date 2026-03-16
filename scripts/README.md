# 🛠️ Scripts Utilitas Database & Setup

Folder ini berisi berbagai script utility untuk membantu mengelola data dan setup awal aplikasi BNetID.

## 📋 Daftar Scripts

### 1. **listAllImages.js** - Lihat Semua Gambar

Menampilkan daftar lengkap semua gambar di database berdasarkan kategori.

**Gunakan untuk:**

- Melihat overview semua gambar
- Debugging (cek apakah gambar sudah tersimpan di DB)
- Monitoring status publikasi gambar

**Cara Jalankan:**

```bash
node scripts/listAllImages.js
```

**Contoh Output:**

```
📸 Semua Gambar di Database BNetID
=====================================

📁 Kategori: HOMEPAGE
-----------------------------------
  1. [0] Gedung BNetID - Hero Slider 1
     Status: ✅ Aktif
     URL: http://localhost:3001/images/clients/beranda.png
     Alt: Gedung BNetID dengan background kota
     ID: clx123abc...

  2. [1] Layanan Internet - Hero Slider 2
     Status: ✅ Aktif
     URL: http://localhost:3001/images/clients/layanan1.png
     Alt: Visualisasi layanan internet BNetID
     ID: clx123def...

  Total: 2 | Aktif: 2
```

---

### 2. **insertHomepageImages.js** - Insert Gambar Homepage Awal

Memasukkan gambar homepage default dari folder `public/images/clients/` ke database.

**Gunakan untuk:**

- Setup awal: populating database dengan gambar default
- Restore data jika gambar homepage terhapus

**Cara Jalankan:**

```bash
node scripts/insertHomepageImages.js
```

**Yang Dimasukkan:**

- `beranda.png` → Order 0 (Slider pertama)
- `layanan1.png` → Order 1 (Slider kedua)
- `layanan2.png` → Order 2 (Slider ketiga)

**Catatan:**

- Script otomatis cek duplikasi (tidak akan insert 2x)
- Semua gambar di-set ke status "Aktif" (published: true)
- URL otomatis ditambahkan dengan prefix `http://localhost:3001`

---

### 3. **checkKlien.js** - Lihat Gambar Klien

Menampilkan semua logo klien yang tersimpan di database.

**Gunakan untuk:**

- Cek daftar logoklien yang ada
- Debugging issue dengan tampilan klien logos

**Cara Jalankan:**

```bash
node scripts/checkKlien.js
```

---

## 🚀 Workflow Setup Pertama Kali

Jika Anda baru pertama kali setup, ikuti langkah ini:

### 1. Setup Database

```bash
# Jalankan migrasi database
npx prisma migrate dev

# Atau jika sudah ada database lama
npx prisma migrate reset
```

### 2. Insert Data Awal

```bash
# Masukkan gambar homepage default
node scripts/insertHomepageImages.js
```

### 3. Verifikasi

```bash
# Lihat semua gambar di database
node scripts/listAllImages.js
```

### 4. Run Aplikasi

```bash
# Terminal 1 - Frontend + Vite
npm run dev

# Terminal 2 - Backend Server
node src/server/index.js
```

### 5. Akses Admin Panel

Buka browser: `http://localhost:5173/admin/panel`

Anda akan melihat gambar-gambar di kategori "Homepage"! 🎉

---

## 📝 Membuat Script Baru

Jika Anda ingin membuat script utility baru, ikuti template ini:

```javascript
import prisma from "../src/server/lib/prisma.js";

/**
 * Deskripsi script
 * Gunakan untuk: ...
 * Jalankan: node scripts/yourscript.js
 */

async function yourFunction() {
  try {
    console.log("🔄 Processing...");

    // Kode Anda di sini
    const data = await prisma.yourModel.findMany();

    console.log("✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

yourFunction();
```

---

## 🔧 Troubleshooting

### Script Error: "Cannot find module 'prisma'"

**Solusi:**

```bash
npm install
```

### Script Error: DATABASE_URL not found

**Solusi:**

- Pastikan file `.env` sudah ada di root project
- Cek variabel `DATABASE_URL` di `.env`
- Restart terminal setelah update `.env`

### Prisma: Connection Refused

**Solusi:**

- Pastikan MySQL/database sudah berjalan
- Update DATABASE_URL di `.env` dengan host/port yang benar

---

## 📌 Important Notes

- ⚠️ **Hati-hati dengan script delete** - Data yang dihapus tidak bisa di-recovery
- 💾 **Backup database** sebelum menjalankan script reset/delete
- 🔑 **Jangan commit `.env`** ke git (sudah di .gitignore)

---

**Last Updated**: March 5, 2026  
**Maintained by**: Admin Team
