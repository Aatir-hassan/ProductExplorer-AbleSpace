# Setup Without Docker

Since Docker Compose isn't available, here are alternative setup methods:

## Option 1: Use SQLite (Easiest)

### 1. Install Dependencies
```bash
# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Update Backend Database Configuration
Edit `backend/src/app.module.ts` and change the database configuration:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  database: 'product_explorer.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
}),
```

### 3. Start the Applications
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Option 2: Install Docker Desktop

### 1. Download Docker Desktop
- Go to https://www.docker.com/products/docker-desktop/
- Download Docker Desktop for Windows
- Install and restart your computer

### 2. After Docker Installation
```bash
docker-compose up -d postgres redis
```

## Option 3: Use Online Database Services

### 1. Use Supabase (Free PostgreSQL)
- Go to https://supabase.com
- Create a new project
- Get your database URL
- Update `backend/.env` with your Supabase URL

### 2. Use Railway (Free PostgreSQL + Redis)
- Go to https://railway.app
- Create new project
- Add PostgreSQL and Redis services
- Get connection strings
- Update environment variables

## Option 4: Local PostgreSQL Installation

### 1. Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set

### 2. Create Database
```sql
CREATE DATABASE product_explorer;
```

### 3. Update Environment Variables
Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/product_explorer
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
```

## Recommended: Quick Start with SQLite

The easiest way to get started is with SQLite. Let me update the configuration for you.