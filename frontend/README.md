# Frontend Setup

## Installation

```bash
cd frontend
npm install
```

## Configuration

- `.env.local` sudah configured dengan:
  - `VITE_API_BASE_URL=http://localhost:3001/api` (untuk production)
  - Vite proxy `/api` ke backend di development

## Running

```bash
npm run dev
```

Server akan jalan di `http://localhost:5173`

## Build

```bash
npm run build
```

## API Calls

- Di development: Gunakan `/api` (proxy akan forward ke backend)
- Di production: Pastikan `VITE_API_BASE_URL` point ke production backend URL

## Struktur

- `src/` - React components
- `public/` - Static assets
- `vite.config.js` - Vite configuration dengan proxy settings
