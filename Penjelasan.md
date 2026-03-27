# 📖 Penjelasan Setup Proyek BNetID

## 🚀 Langkah-langkah Setelah Git Clone

Berikut panduan lengkap dan bertahap untuk menjalankan proyek ini setelah `git clone`. Proyek ini adalah aplikasi web **React (Vite) + Express backend + Prisma (MySQL) + TailwindCSS**.

### 1. **Install Dependencies**

Buka terminal di root folder proyek:

```bash
npm install
```

### 2. **Setup Database (MySQL)**

- **Pastikan MySQL berjalan** (lokal/remote, port 3306).
- **Buat file `.env`** di root proyek:
  ```
  DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/nama_database"
  ```
  Ganti dengan kredensial MySQL Anda.
- **Jalankan Prisma**:
  ```bash
  npx prisma generate
  npx prisma migrate dev
  ```

### 3. **Setup Data Awal (Recommended)**

Masukkan gambar homepage default:

```bash
node scripts/insertHomepageImages.js
```

Verifikasi:

```bash
node scripts/listAllImages.js
```

### 4. **Buat Admin User**

```bash
node scripts/create-admin.js
```

### 5. **Jalankan Server**

**Satu terminal** (fullstack):

```bash
npm run dev
```

Atau **terpisah**:

- Terminal 1 (Backend port 3001): `npm run server`
- Terminal 2 (Frontend port 5173): `npm run dev`

### 6. **Akses Aplikasi**

| Halaman     | URL                               |
| ----------- | --------------------------------- |
| Frontend    | http://localhost:5173             |
| Admin Panel | http://localhost:5173/admin/panel |
| API/Images  | http://localhost:3001             |

## 🔧 Troubleshooting

| Masalah                  | Solusi                          |
| ------------------------ | ------------------------------- |
| `DATABASE_URL not found` | Buat `.env`, restart terminal.  |
| Connection refused       | Cek MySQL & DATABASE_URL.       |
| Port conflict            | Ganti port di `vite.config.js`. |
| No images                | Jalankan script insert.         |

## 📂 Folder Scripts

Lihat `scripts/README.md` untuk utility database (list, fix, insert data).

**Proyek siap! 🎉** Backup DB sebelum jalankan script delete/reset.

_Last Updated: Berdasarkan struktur proyek saat ini._
