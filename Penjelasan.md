# 📖 BNetID Project Setup Guide

Aplikasi web fullstack dengan **frontend dan backend terpisah** menggunakan:

- ⚛️ React (Vite) - Frontend
- 🚀 Express.js (Backend API)
- 🗄️ Prisma ORM + SQLite
- 🎨 TailwindCSS

---

## ⚙️ Requirements

Pastikan sudah terinstall:

- Node.js >= 18
- npm / yarn / pnpm

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

### Backend Setup

```bash
cd backend
cp .env.example .env          # Copy environment template
npm install                    # Install dependencies
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run database migrations
```

### Frontend Setup

```bash
cd ../frontend
cp .env.example .env.local     # Copy environment template
npm install                    # Install dependencies
```

---

## 🔐 Environment Setup

### Backend (`backend/.env`)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## 🗄️ Database Setup (Prisma)

Jalankan perintah di folder `backend`:

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio untuk melihat data
npm run prisma:studio
```

### 🔁 Jika terjadi error migration:

```bash
npm run prisma:reset
```

> ⚠️ Perintah ini akan menghapus seluruh data database

---

## 🌱 Seed / Data Awal (Recommended)

Di folder root project, jalankan script:

```bash
# Insert data gambar homepage
node scripts/insertDefaultHomepageImages.js

# Insert logo klien
node scripts/insertDefaultClientLogos.js

# Cek data
node scripts/listAllImages.js
```

---

## 👤 Setup Admin User

```bash
node scripts/create-admin.js
```

---

## ▶️ Menjalankan Aplikasi

### Menggunakan 2 Terminal (Recommended)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

→ Backend jalan di `http://localhost:3001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

→ Frontend jalan di `http://localhost:5173`

---

## 🌐 Akses Aplikasi

| Halaman     | URL                                       |
| ----------- | ----------------------------------------- |
| Frontend    | http://localhost:5173                     |
| Admin Panel | http://localhost:5173/admin/panel         |
| API Server  | http://localhost:3001                     |
| API Docs    | http://localhost:3001/api/docs (jika ada) |

---

## 🏗️ Build Production

### Build Frontend

```bash
cd frontend
npm run build
```

### Deploy Backend

Backend siap di-deploy ke server dengan:

```bash
npm install
npm run prisma:migrate
npm run build
npm start
```

---

## 📁 Struktur Proyek

```
project/
├── backend/                    # Express API server
│   ├── src/
│   │   └── server/
│   │       ├── index.js       # Express app entry
│   │       ├── routes/        # API routes (auth, images)
│   │       └── lib/           # Utilities (paths, prisma client)
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration files
│   ├── .env                   # Backend config (git ignored)
│   ├── .env.example           # Template untuk .env
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── admin/             # Admin panel
│   │   ├── config/            # API config
│   │   └── Login/             # Authentication pages
│   ├── public/                # Static assets
│   ├── vite.config.js         # Vite + proxy configuration
│   ├── .env.local             # Frontend config (git ignored)
│   ├── .env.example           # Template untuk .env.local
│   ├── package.json
│   └── README.md
│
├── scripts/                    # Utility scripts (shared)
├── public/                     # Shared public assets
└── .gitignore                 # Git ignore file
```

---

## 🔧 Troubleshooting

| Masalah                   | Solusi                                                    |
| ------------------------- | --------------------------------------------------------- |
| `npm install` error       | Hapus `node_modules` & `package-lock.json`, `npm install` |
| DATABASE_URL not found    | Pastikan `backend/.env` ada & restart terminal            |
| Port 3001 sudah digunakan | Ubah PORT di `backend/.env`                               |
| Port 5173 sudah digunakan | Edit `frontend/vite.config.js`                            |
| Data tidak muncul         | Jalankan `npm run prisma:migrate` di backend              |
| Error Prisma              | Jalankan `npm run prisma:reset` di backend                |
| API calls gagal (CORS)    | Pastikan backend running & frontend proxy terkonfigurasi  |

---

## 📂 Scripts Utility

Ubicaed di root `scripts/` folder:

```
scripts/
├── create-admin.js                    # Buat admin user
├── insertDefaultHomepageImages.js    # Insert homepage images
├── insertDefaultClientLogos.js       # Insert client logos
├── listAllImages.js                  # Query all images
└── ... (utility scripts lainnya)
```

Jalankan dari root project:

```bash
node scripts/create-admin.js
node scripts/insertDefaultHomepageImages.js
```

---

## ⚠️ Important Notes

- **Jangan commit `.env` files** - Sudah di `.gitignore`
- Gunakan `.env.example` sebagai template
- Backup database sebelum menjalankan `prisma:reset`
- Untuk kolaborasi: Copy `.env.example` → `.env` / `.env.local`

---

## 🚀 Live Migration ke Production Server (Zero Downtime)

### 1. **Server VPS/Hosting (Node.js ready)**

```
Ubuntu 22.04+, Node.js 18+, nginx, PM2
Domain + SSL Let's Encrypt, 2GB RAM min
```

### 2. **Backup Semua (KRITIS!)**

```bash
# Backup database
cp backend/prisma/dev.db backup_$(date +%s).db

# Backup uploaded files
tar -czf assets.tar.gz public/images

# Backup project
git archive HEAD > project.zip
```

### 3. **Deploy Backend**

```bash
# Clone repository
git clone <repo> bnetid
cd bnetid/backend

# Copy .env production
cp .env.example .env
# Edit .env dengan production settings

# Setup
npm ci
npm run prisma:migrate
npm run prisma:generate
node scripts/create-admin.js
```

### 4. **Deploy Frontend**

```bash
cd ../frontend

# Copy .env
cp .env.example .env.local
# Edit .env.local dengan production API URL

# Build
npm ci
npm run build
```

### 5. **PM2 Process Manager**

```bash
npm i -g pm2

# Start backend
pm2 start backend/src/server/index.js --name bnetid-api

# Save & startup on boot
pm2 save
pm2 startup
```

### 6. **Nginx Config**

```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  # Frontend (built files)
  location / {
    root /path/to/frontend/dist;
    try_files $uri $uri/ /index.html;
  }

  # API Proxy
  location /api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Images
  location /images/ {
    proxy_pass http://localhost:3001/images/;
  }
}
```

### 7. **Go Live**

```bash
# Update DNS records
# Monitor logs
pm2 logs bnetid-api

# Test endpoints
curl https://yourdomain.com/api/health
```

**Estimasi: 1-2 jam**

---

## ✅ Status

✔️ Siap untuk development  
✔️ Siap untuk deployment

---

## 🎉 Penutup

Proyek sudah siap digunakan dan dikembangkan lebih lanjut.  
Jika ada kendala, cek troubleshooting atau hubungi developer.

**Admin Login:**  
Email: AdminBNetID@gmail.com  
Password: 17028B  
URL: /loginadminpanel (via frontend)
