# Product Data Explorer API Documentation

## Overview

The Product Data Explorer API provides endpoints for managing and scraping product data from World of Books. The API is built with NestJS and follows RESTful conventions.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://your-backend-url.com`

## Authentication

Currently, the API does not require authentication for basic operations. Rate limiting is implemented to prevent abuse.

## API Endpoints

### Health Check

#### GET /
Get application health status.

**Response:**
```json
{
  "message": "Product Data Explorer API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### GET /health
Get detailed health information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600,
  "memory": {
    "rss": 50000000,
    "heapTotal": 20000000,
    "heapUsed": 15000000,
    "external": 1000000
  }
}
```

### Navigation

#### GET /api/navigation
Get all navigation items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Books",
      "slug": "books",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "last_scraped_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/navigation/:id
Get navigation item by ID.

**Parameters:**
- `id` (string): Navigation ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Books",
    "slug": "books",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "last_scraped_at": "2024-01-01T00:00:00.000Z",
    "categories": []
  }
}
```

### Categories

#### GET /api/categories
Get all categories with pagination.

**Query Parameters:**
- `navigation_id` (string, optional): Filter by navigation ID
- `parent_id` (string, optional): Filter by parent category ID
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "navigation_id": "uuid",
      "parent_id": null,
      "title": "Fiction",
      "slug": "fiction",
      "product_count": 150,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "last_scraped_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

#### GET /api/categories/:id
Get category by ID.

**Parameters:**
- `id` (string): Category ID

**Response:**
```json
{
  "id": "uuid",
  "navigation_id": "uuid",
  "parent_id": null,
  "title": "Fiction",
  "slug": "fiction",
  "product_count": 150,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "last_scraped_at": "2024-01-01T00:00:00.000Z",
  "navigation": {},
  "parent": null,
  "children": [],
  "products": []
}
```

### Products

#### GET /api/products
Get all products with pagination and filtering.

**Query Parameters:**
- `category_id` (string, optional): Filter by category ID
- `search` (string, optional): Search in product titles
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "source_id": "12345",
      "title": "The Great Gatsby",
      "price": 12.99,
      "currency": "GBP",
      "image_url": "https://example.com/image.jpg",
      "source_url": "https://www.worldofbooks.com/book/12345",
      "category_id": "uuid",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "last_scraped_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

#### GET /api/products/:id
Get product by ID with details and reviews.

**Parameters:**
- `id` (string): Product ID

**Response:**
```json
{
  "id": "uuid",
  "source_id": "12345",
  "title": "The Great Gatsby",
  "price": 12.99,
  "currency": "GBP",
  "image_url": "https://example.com/image.jpg",
  "source_url": "https://www.worldofbooks.com/book/12345",
  "category_id": "uuid",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "last_scraped_at": "2024-01-01T00:00:00.000Z",
  "detail": {
    "id": "uuid",
    "product_id": "uuid",
    "description": "A classic American novel...",
    "specs": {
      "pages": 180,
      "language": "English",
      "publisher": "Scribner"
    },
    "ratings_avg": 4.5,
    "reviews_count": 25,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "reviews": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "author": "John Doe",
      "rating": 5,
      "text": "Excellent book!",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Scraping

#### POST /api/scrape/navigation
Trigger navigation scraping.

**Response:**
```json
{
  "success": true,
  "message": "Navigation scraped successfully"
}
```

#### POST /api/scrape/category/:id
Trigger category scraping.

**Parameters:**
- `id` (string): Category ID

**Response:**
```json
{
  "success": true,
  "message": "Category scraped successfully"
}
```

#### POST /api/scrape/product/:id
Trigger product scraping.

**Parameters:**
- `id` (string): Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product scraped successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Navigation scraping**: 1 request per minute
- **Category scraping**: 5 requests per minute
- **Product scraping**: 10 requests per minute
- **General API calls**: 100 requests per minute

## Caching

The API implements intelligent caching:

- **Navigation data**: Cached for 1 hour
- **Category data**: Cached for 30 minutes
- **Product data**: Cached for 15 minutes
- **Scraped data**: Cached based on last_scraped_at timestamp

## WebSocket Events

The API supports real-time updates via WebSocket:

- `scraping:started`: Scraping job started
- `scraping:progress`: Scraping job progress update
- `scraping:completed`: Scraping job completed
- `scraping:failed`: Scraping job failed

## Examples

### Get all products in a category
```bash
curl -X GET "http://localhost:3001/api/products?category_id=uuid&page=1&limit=20"
```

### Search products
```bash
curl -X GET "http://localhost:3001/api/products?search=gatsby&page=1&limit=20"
```

### Trigger product scraping
```bash
curl -X POST "http://localhost:3001/api/scrape/product/uuid"
```

## SDK Examples

### JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3001/api/products', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

### Python
```python
import requests

response = requests.get('http://localhost:3001/api/products')
data = response.json()
```

## Support

For API support and questions, please refer to the main README.md file or contact the development team.