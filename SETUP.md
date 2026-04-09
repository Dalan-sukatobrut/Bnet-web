# BNetid - Frontend & Backend Separated

Project ini sudah di-pisahkan menjadi **frontend** dan **backend** terpisah.

## Quick Start

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run dev
```

→ Backend akan jalan di `http://localhost:3001`

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

→ Frontend akan jalan di `http://localhost:5173`

## Struktur

```
project/
├── backend/              # Express server + Prisma database
│   ├── src/server/      # Express app code
│   ├── prisma/          # Database schema & migrations
│   ├── package.json
│   └── .env             # Backend configuration
│
├── frontend/            # React + Vite app
│   ├── src/             # React components
│   ├── public/          # Static assets
│   ├── vite.config.js   # Vite proxy configuration
│   ├── package.json
│   └── .env.local       # Frontend configuration
│
└── scripts/             # Utility scripts (shared)
```

## Komunikasi Backend ↔ Frontend

- **Development**: Frontend menggunakan Vite proxy `/api` → `http://localhost:3001/api`
- **Production**: Update `VITE_API_BASE_URL` di frontend `.env`

## Environment Variables

### Backend (backend/.env)

- `PORT=3001`
- `DATABASE_URL="file:./prisma/dev.db"`
- `JWT_SECRET` - Change in production!
- `ALLOWED_ORIGINS` - CORS allowed origins

### Frontend (frontend/.env.local)

- `VITE_API_BASE_URL` - Digunakan untuk production
- Vite proxy development otomatis forward `/api` ke backend

## Catatan

- Database (Prisma/SQLite) berada di backend
- Setiap aplikasi punya `package.json` sendiri
- Untuk development, jalankan backend dan frontend di terminal terpisah
