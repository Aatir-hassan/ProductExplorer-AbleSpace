// const express = require('express');
// const cors = require('cors');
// const sqlite3 = require('sqlite3').verbose();
// const { PlaywrightCrawler } = require('crawlee');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database setup
// const db = new sqlite3.Database('product_explorer.db');

// // Initialize database tables
// db.serialize(() => {
//   // Navigation table
//   db.run(`CREATE TABLE IF NOT EXISTS navigation (
//     id TEXT PRIMARY KEY,
//     title TEXT UNIQUE,
//     slug TEXT UNIQUE,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     last_scraped_at DATETIME
//   )`);

//   // Categories table
//   db.run(`CREATE TABLE IF NOT EXISTS category (
//     id TEXT PRIMARY KEY,
//     navigation_id TEXT,
//     parent_id TEXT,
//     title TEXT,
//     slug TEXT,
//     product_count INTEGER DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     last_scraped_at DATETIME,
//     FOREIGN KEY (navigation_id) REFERENCES navigation(id)
//   )`);

//   // Products table
//   db.run(`CREATE TABLE IF NOT EXISTS product (
//     id TEXT PRIMARY KEY,
//     source_id TEXT UNIQUE,
//     title TEXT,
//     price REAL,
//     currency TEXT DEFAULT 'GBP',
//     image_url TEXT,
//     source_url TEXT,
//     category_id TEXT,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     last_scraped_at DATETIME,
//     FOREIGN KEY (category_id) REFERENCES category(id)
//   )`);

//   // Product details table
//   db.run(`CREATE TABLE IF NOT EXISTS product_detail (
//     id TEXT PRIMARY KEY,
//     product_id TEXT UNIQUE,
//     description TEXT,
//     specs TEXT,
//     ratings_avg REAL,
//     reviews_count INTEGER DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (product_id) REFERENCES product(id)
//   )`);

//   // Reviews table
//   db.run(`CREATE TABLE IF NOT EXISTS review (
//     id TEXT PRIMARY KEY,
//     product_id TEXT,
//     author TEXT,
//     rating INTEGER,
//     text TEXT,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (product_id) REFERENCES product(id)
//   )`);

//   // Scrape jobs table
//   db.run(`CREATE TABLE IF NOT EXISTS scrape_job (
//     id TEXT PRIMARY KEY,
//     target_url TEXT,
//     target_type TEXT,
//     status TEXT DEFAULT 'pending',
//     started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     finished_at DATETIME,
//     error_log TEXT
//   )`);
// });

// // Utility functions
// const generateId = () => Math.random().toString(36).substr(2, 9);

// // Routes

// // Health check
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Product Data Explorer API is running',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0'
//   });
// });

// app.get('/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development',
//     uptime: process.uptime()
//   });
// });

// // Navigation endpoints
// app.get('/api/navigation', (req, res) => {
//   db.all('SELECT * FROM navigation ORDER BY created_at ASC', (err, rows) => {
//     if (err) {
//       res.status(500).json({ success: false, message: err.message });
//       return;
//     }
//     res.json({ success: true, data: rows });
//   });
// });

// app.get('/api/navigation/:id', (req, res) => {
//   const { id } = req.params;
//   db.get('SELECT * FROM navigation WHERE id = ?', [id], (err, row) => {
//     if (err) {
//       res.status(500).json({ success: false, message: err.message });
//       return;
//     }
//     if (!row) {
//       res.status(404).json({ success: false, message: 'Navigation not found' });
//       return;
//     }
//     res.json({ success: true, data: row });
//   });
// });

// // Categories endpoints
// app.get('/api/categories', (req, res) => {
//   const { navigation_id, parent_id, page = 1, limit = 20 } = req.query;
//   let query = 'SELECT * FROM category WHERE 1=1';
//   const params = [];

//   if (navigation_id) {
//     query += ' AND navigation_id = ?';
//     params.push(navigation_id);
//   }
//   if (parent_id) {
//     query += ' AND parent_id = ?';
//     params.push(parent_id);
//   }

//   query += ' ORDER BY title ASC LIMIT ? OFFSET ?';
//   params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

//   db.all(query, params, (err, rows) => {
//     if (err) {
//       res.status(500).json({ success: false, message: err.message });
//       return;
//     }

//     // Get total count
//     let countQuery = 'SELECT COUNT(*) as total FROM category WHERE 1=1';
//     const countParams = [];
//     if (navigation_id) {
//       countQuery += ' AND navigation_id = ?';
//       countParams.push(navigation_id);
//     }
//     if (parent_id) {
//       countQuery += ' AND parent_id = ?';
//       countParams.push(parent_id);
//     }

//     db.get(countQuery, countParams, (err, countRow) => {
//       if (err) {
//         res.status(500).json({ success: false, message: err.message });
//         return;
//       }

//       const total = countRow.total;
//       const totalPages = Math.ceil(total / parseInt(limit));

//       res.json({
//         data: rows,
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages
//       });
//     });
//   });
// });

// // Products endpoints
// app.get('/api/products', (req, res) => {
//   const { category_id, search, page = 1, limit = 20 } = req.query;
//   let query = 'SELECT * FROM product WHERE 1=1';
//   const params = [];

//   if (category_id) {
//     query += ' AND category_id = ?';
//     params.push(category_id);
//   }
//   if (search) {
//     query += ' AND title LIKE ?';
//     params.push(`%${search}%`);
//   }

//   query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
//   params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

//   db.all(query, params, (err, rows) => {
//     if (err) {
//       res.status(500).json({ success: false, message: err.message });
//       return;
//     }

//     // Get total count
//     let countQuery = 'SELECT COUNT(*) as total FROM product WHERE 1=1';
//     const countParams = [];
//     if (category_id) {
//       countQuery += ' AND category_id = ?';
//       countParams.push(category_id);
//     }
//     if (search) {
//       countQuery += ' AND title LIKE ?';
//       countParams.push(`%${search}%`);
//     }

//     db.get(countQuery, countParams, (err, countRow) => {
//       if (err) {
//         res.status(500).json({ success: false, message: err.message });
//         return;
//       }

//       const total = countRow.total;
//       const totalPages = Math.ceil(total / parseInt(limit));

//       res.json({
//         data: rows,
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages
//       });
//     });
//   });
// });

// app.get('/api/products/:id', (req, res) => {
//   const { id } = req.params;

//   // Get product
//   db.get('SELECT * FROM product WHERE id = ?', [id], (err, product) => {
//     if (err) {
//       res.status(500).json({ success: false, message: err.message });
//       return;
//     }
//     if (!product) {
//       res.status(404).json({ success: false, message: 'Product not found' });
//       return;
//     }

//     // Get product details
//     db.get('SELECT * FROM product_detail WHERE product_id = ?', [id], (err, detail) => {
//       if (err) {
//         res.status(500).json({ success: false, message: err.message });
//         return;
//       }

//       // Get reviews
//       db.all('SELECT * FROM review WHERE product_id = ? ORDER BY created_at DESC', [id], (err, reviews) => {
//         if (err) {
//           res.status(500).json({ success: false, message: err.message });
//           return;
//         }

//         res.json({
//           ...product,
//           detail,
//           reviews
//         });
//       });
//     });
//   });
// });

// // Scraping endpoints
// app.post('/api/scrape/navigation', async (req, res) => {
//   try {
//     const jobId = generateId();

//     // Create scrape job
//     db.run(
//       'INSERT INTO scrape_job (id, target_url, target_type, status) VALUES (?, ?, ?, ?)',
//       [jobId, 'https://www.worldofbooks.com', 'navigation', 'running']
//     );

//     // Simple navigation scraping (mock data for now)
//     const mockNavigation = [
//       { id: generateId(), title: 'Books', slug: 'books' },
//       { id: generateId(), title: 'Children\'s Books', slug: 'childrens-books' },
//       { id: generateId(), title: 'Fiction', slug: 'fiction' },
//       { id: generateId(), title: 'Non-Fiction', slug: 'non-fiction' }
//     ];

//     // Insert navigation items
//     mockNavigation.forEach(item => {
//       db.run(
//         'INSERT OR REPLACE INTO navigation (id, title, slug, last_scraped_at) VALUES (?, ?, ?, ?)',
//         [item.id, item.title, item.slug, new Date().toISOString()]
//       );
//     });

//     // Update job status
//     db.run(
//       'UPDATE scrape_job SET status = ?, finished_at = ? WHERE id = ?',
//       ['completed', new Date().toISOString(), jobId]
//     );

//     res.json({ success: true, message: 'Navigation scraped successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.post('/api/scrape/category/:id', (req, res) => {
//   const { id } = req.params;

//   // Mock category scraping
//   const mockProducts = [
//     {
//       id: generateId(),
//       source_id: generateId(),
//       title: 'Sample Book 1',
//       price: 12.99,
//       currency: 'GBP',
//       image_url: 'https://via.placeholder.com/200x300',
//       source_url: 'https://www.worldofbooks.com/book/1',
//       category_id: id
//     },
//     {
//       id: generateId(),
//       source_id: generateId(),
//       title: 'Sample Book 2',
//       price: 15.99,
//       currency: 'GBP',
//       image_url: 'https://via.placeholder.com/200x300',
//       source_url: 'https://www.worldofbooks.com/book/2',
//       category_id: id
//     }
//   ];

//   // Insert mock products
//   mockProducts.forEach(product => {
//     db.run(
//       'INSERT OR REPLACE INTO product (id, source_id, title, price, currency, image_url, source_url, category_id, last_scraped_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       [product.id, product.source_id, product.title, product.price, product.currency, product.image_url, product.source_url, product.category_id, new Date().toISOString()]
//     );
//   });

//   res.json({ success: true, message: 'Category scraped successfully' });
// });

// app.post('/api/scrape/product/:id', (req, res) => {
//   const { id } = req.params;

//   // Mock product detail scraping
//   const mockDetail = {
//     id: generateId(),
//     product_id: id,
//     description: 'This is a sample book description with detailed information about the content.',
//     specs: JSON.stringify({ pages: 300, language: 'English', publisher: 'Sample Publisher' }),
//     ratings_avg: 4.5,
//     reviews_count: 25
//   };

//   db.run(
//     'INSERT OR REPLACE INTO product_detail (id, product_id, description, specs, ratings_avg, reviews_count) VALUES (?, ?, ?, ?, ?, ?)',
//     [mockDetail.id, mockDetail.product_id, mockDetail.description, mockDetail.specs, mockDetail.ratings_avg, mockDetail.reviews_count]
//   );

//   // Add some mock reviews
//   const mockReviews = [
//     { id: generateId(), product_id: id, author: 'John Doe', rating: 5, text: 'Great book!' },
//     { id: generateId(), product_id: id, author: 'Jane Smith', rating: 4, text: 'Very good read.' }
//   ];

//   mockReviews.forEach(review => {
//     db.run(
//       'INSERT OR REPLACE INTO review (id, product_id, author, rating, text) VALUES (?, ?, ?, ?, ?)',
//       [review.id, review.product_id, review.author, review.rating, review.text]
//     );
//   });

//   res.json({ success: true, message: 'Product scraped successfully' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
// });

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('\n🛑 Shutting down server...');
//   db.close((err) => {
//     if (err) {
//       console.error('Error closing database:', err.message);
//     } else {
//       console.log('✅ Database connection closed.');
//     }
//     process.exit(0);
//   });
// });