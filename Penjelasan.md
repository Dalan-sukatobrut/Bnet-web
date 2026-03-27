# 📖 BNetID Project Setup Guide

Aplikasi web fullstack menggunakan:

* ⚛️ React (Vite)
* 🚀 Express.js (Backend API)
* 🗄️ Prisma ORM + MySQL
* 🎨 TailwindCSS

---

## ⚙️ Requirements

Pastikan sudah terinstall:

* Node.js >= 18
* MySQL >= 5.7 / 8
* npm / yarn / pnpm

Cek versi:

```bash
node -v
npm -v
```

---

## 🚀 Installation

Clone repository:

```bash
git clone <repo-url>
cd <nama-project>
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Setup

Buat file `.env` di root project:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/nama_database"
PORT=3001
```

Contoh:

```env
DATABASE_URL="mysql://root:password@localhost:3306/bnetid"
PORT=3001
```

---

## 🗄️ Database Setup (Prisma)

Jalankan perintah berikut:

```bash
npx prisma generate
npx prisma migrate dev
```

### 🔁 Jika terjadi error migration:

```bash
npx prisma migrate reset
```

> ⚠️ Perintah ini akan menghapus seluruh data database

---

## 🌱 Seed / Data Awal (Recommended)

Insert data gambar homepage:

```bash
node scripts/insertHomepageImages.js
```

Cek data:

```bash
node scripts/listAllImages.js
```

---

## 👤 Setup Admin User

```bash
node scripts/create-admin.js
```

---

## ▶️ Menjalankan Aplikasi

### 🔹 Mode Fullstack (Recommended)

```bash
npm run dev
```

Menjalankan:

* Frontend (Vite) → http://localhost:5173
* Backend (Express) → http://localhost:3001

---

### 🔹 Mode Terpisah

Terminal 1 (Backend):

```bash
npm run server
```

Terminal 2 (Frontend):

```bash
npm run dev
```

---

## 🌐 Akses Aplikasi

| Halaman     | URL                               |
| ----------- | --------------------------------- |
| Frontend    | http://localhost:5173             |
| Admin Panel | http://localhost:5173/admin/panel |
| API Server  | http://localhost:3001             |

---

## 🏗️ Build Production

Build project:

```bash
npm run build
```

Jalankan production:

```bash
npm start
```

---

## 📁 Struktur Proyek

```
.
├── src/
│   ├── components/     # Komponen React
│   ├── pages/          # Halaman frontend
│   └── server/         # Express backend
│
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Migration files
│
├── scripts/            # Script helper (seed, admin, dll)
├── public/             # Static assets
└── .env                # Environment config
```

---

## 🔧 Troubleshooting

| Masalah                | Solusi                                 |
| ---------------------- | -------------------------------------- |
| DATABASE_URL not found | Pastikan `.env` ada & restart terminal |
| MySQL tidak connect    | Cek service MySQL & kredensial         |
| Port sudah digunakan   | Ubah port di `.env` / vite.config.js   |
| Data tidak muncul      | Jalankan script seed                   |
| Error Prisma           | Jalankan prisma migrate reset          |

---

## 📂 Scripts Utility

Lihat dokumentasi lengkap di:

```
scripts/README.md
```

Digunakan untuk:

* Insert data
* List data
* Fix data
* Create admin

---

## ⚠️ Important Notes

* Selalu backup database sebelum menjalankan script reset/delete
* Jangan commit file `.env` ke repository
* Gunakan `.env.example` untuk sharing config

---

## ✅ Status

✔️ Siap untuk development
✔️ Siap untuk deployment (dengan konfigurasi tambahan)

---

## 🎉 Penutup

Proyek sudah siap digunakan dan dikembangkan lebih lanjut.
Jika ada kendala, silakan cek bagian troubleshooting atau hubungi developer.




Email: AdminBNetID@gmail.com
Password: 17028B


cara masuk ke login admin 
url/loginadminpanel