# Backend Setup

## Installation

```bash
cd backend
npm install
```

## Configuration

- `.env` sudah configured dengan:
  - `PORT=3001` - Backend server port
  - `DATABASE_URL="file:./prisma/dev.db"` - SQLite database
  - `JWT_SECRET` - Change this in production!
  - `ALLOWED_ORIGINS` - CORS allowed origins

## Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

## Running

```bash
npm run dev
```

Server akan jalan di `http://localhost:3001`

## API Endpoints

- Auth: `/api/auth/*`
- Images: `/api/images/*`
- Static files: `/images/*`

## Project Structure

- `src/server/` - Express server code
- `src/server/routes/` - API routes
- `src/server/lib/` - Utilities (paths, database client)
- `prisma/` - Database schema dan migrations
