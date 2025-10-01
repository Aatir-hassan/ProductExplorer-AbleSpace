# Product Data Explorer

A production-minded product exploration platform that lets users navigate from high-level headings → categories → products → product detail pages powered by live, on-demand scraping from World of Books.

## Architecture Overview

This is a full-stack application with:
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: NestJS with TypeScript, PostgreSQL database
- **Scraping**: Crawlee + Playwright for World of Books data extraction
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## Tech Stack

### Frontend
- React 18 with Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SWR for data fetching
- Responsive design with accessibility features

### Backend
- NestJS framework
- TypeScript
- PostgreSQL database
- Crawlee + Playwright for scraping
- Queue system for background jobs
- Rate limiting and caching

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # NestJS application
├── docker-compose.yml # Local development setup
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Local Development

1. **Clone and install dependencies:**
```bash
git clone <repo-url>
cd product-data-explorer
npm install
```

2. **Set up environment variables:**
```bash
# Copy environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit the files with your configuration
```

3. **Start the database:**
```bash
# Using Docker
docker-compose up -d postgres

# Or use your local PostgreSQL instance
```

4. **Run database migrations:**
```bash
cd backend
npm run migration:run
```

5. **Start development servers:**
```bash
# From root directory
npm run dev

# Or start individually:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/product_explorer
JWT_SECRET=your-jwt-secret
SCRAPING_RATE_LIMIT=1000
CACHE_TTL=3600
```

## API Documentation

The backend exposes RESTful endpoints:

- `GET /api/navigation` - Get navigation headings
- `GET /api/categories` - Get categories with pagination
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/scrape/navigation` - Trigger navigation scrape
- `POST /api/scrape/category/:id` - Trigger category scrape
- `POST /api/scrape/product/:id` - Trigger product scrape

Full API documentation available at `/api/docs` when running the backend.

## Database Schema

The application uses PostgreSQL with the following main entities:
- `navigation` - Top-level navigation headings
- `category` - Product categories and subcategories
- `product` - Product information
- `product_detail` - Detailed product data
- `review` - Product reviews and ratings
- `scrape_job` - Background scraping jobs
- `view_history` - User browsing history

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy automatically on push to main

### Backend (Railway/Render)
1. Connect your GitHub repo
2. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_HOST`: Redis host
   - `REDIS_PORT`: Redis port
   - `NODE_ENV`: production
3. Configure PostgreSQL database
4. Deploy

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
```bash
# Backend
cd backend
npm install
npm run build
npm run start:prod

# Frontend
cd frontend
npm install
npm run build
npm start
```

## Features

### Core Features
- ✅ Navigation headings from World of Books
- ✅ Category drilldown with pagination
- ✅ Product grid with search and filters
- ✅ Product detail pages with reviews
- ✅ Real-time scraping on demand
- ✅ Responsive design (desktop & mobile)
- ✅ Accessibility (WCAG AA basics)
- ✅ Client-side navigation history
- ✅ Caching and rate limiting

### Bonus Features
- 🔄 Product search with rich filters
- 🔄 Intelligent caching strategy
- 🔄 Personalized recommendations
- 🔄 Docker setup with docker-compose
- 🔄 Comprehensive test coverage
- 🔄 API versioning with OpenAPI/Swagger

## Ethical Scraping

This application implements ethical scraping practices:
- Respects robots.txt and terms of service
- Implements rate limiting and delays
- Uses exponential backoff for retries
- Caches results to minimize requests
- Implements proper error handling

## Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details