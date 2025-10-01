//


import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler } from 'crawlee';
import { ScrapeJob, ScrapeJobStatus } from '../../entities/scrape-job.entity';
import { Navigation } from '../../entities/navigation.entity';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // ---------------------------------------
  // SCRAPE NAVIGATION
  // ---------------------------------------
  async scrapeNavigation(): Promise<{ success: boolean; message: string }> {
    const job = await this.createScrapeJob('https://www.worldofbooks.com', 'navigation');
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

      const logger = this.logger;
      const navigationRepository = this.navigationRepository;

      const crawler = new PlaywrightCrawler({
        async requestHandler({ page, request }) {
          logger.log(`Processing: ${request.url}`);
          
          await page.goto(request.url, { waitUntil: 'networkidle' });
          
       const navigationItems = await page.$$eval('a.full-unstyled-link.product-card.truncate-title', elements => {
  return elements.map(el => ({
    title: el.textContent?.trim() || '',
    href: el.getAttribute('href') || ''
  }));
});

// now you can filter
const filteredNavigationItems = navigationItems.filter(item => item.title && item.href);
for (const item of navigationItems) {
  if (item.title && item.href) {
    const slug = item.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await navigationRepository.upsert(
      {
        title: item.title,
        slug,
        // ✅ FIX: normalize relative URLs to full absolute ones
        source_url: item.href
          ? (item.href.startsWith('http')
              ? item.href
              : `https://www.worldofbooks.com${item.href}`)
          : null,
        last_scraped_at: new Date(),
      },
      ['slug'],
    );
  }
}
        },
      });

      await crawler.run(['https://www.worldofbooks.com']);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return { success: true, message: 'Navigation scraped successfully' };
    } catch (error) {
      this.logger.error(`Navigation scraping failed: ${error.message}`);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      return { success: false, message: error.message };
    }
  }

  // ---------------------------------------
  // NEW: SCRAPE CATEGORIES BY NAVIGATION
  // ---------------------------------------
  // ---------------------------------------
// NEW: SCRAPE CATEGORIES BY NAVIGATION
// ---------------------------------------
async scrapeCategoriesByNavigation(navigationId: string): Promise<{ success: boolean; message: string }> {
  const navigation = await this.navigationRepository.findOne({ where: { id: navigationId } });
  if (!navigation) throw new Error('Navigation not found');

  const job = await this.createScrapeJob(navigation.slug, 'navigation-categories');

  try {
    await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

    const logger = this.logger;
    const categoryRepository = this.categoryRepository;

    const crawler = new PlaywrightCrawler({
      async requestHandler({ page }) {
        const targetUrl = navigation.source_url || `https://www.worldofbooks.com/${navigation.slug}`;

        logger.log(`➡️ Visiting: ${targetUrl}`);

        await page.goto(targetUrl, { waitUntil: 'networkidle' });

        // ✅ Wait for navigation menu to load
        await page.waitForSelector('li.has-submenu > a.header_menu-item', { timeout: 20000 });

        // ✅ Extract categories
        const categories = await page.$$eval('li.has-submenu > a.header_menu-item', (elements: any) =>
          elements.map((el: any) => ({
            title: el.textContent?.trim() || '',
            href: el.getAttribute('href') || ''
          }))
        );

        logger.debug(`📊 Found categories: ${JSON.stringify(categories)}`);

        for (const cat of categories) {
          if (cat.title && cat.href) {
            const slug = cat.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/[\s_-]+/g, '-')
              .replace(/^-+|-+$/g, '');

            await categoryRepository.upsert(
              {
                navigation_id: navigationId,
                title: cat.title,
                slug,
                // ✅ Normalize relative links to absolute
                source_url: cat.href.startsWith('http')
                  ? cat.href
                  : `https://www.worldofbooks.com${cat.href}`,
                last_scraped_at: new Date(),
              },
              ['slug'],
            );
          }
        }
      },
    });

    // ✅ Always start from homepage for nav scraping
    await crawler.run([`https://www.worldofbooks.com/en-gb`]);
    await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);

    return { success: true, message: 'Categories scraped successfully' };
  } catch (error) {
    this.logger.error(`Category scraping failed: ${error.message}`);
    await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
    return { success: false, message: error.message };
  }
}

  // ---------------------------------------
  // SCRAPE CATEGORY (PRODUCTS INSIDE A CATEGORY)
  // ---------------------------------------
  async scrapeCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error('Category not found');
    }

    const job = await this.createScrapeJob(category.source_url || '', 'category');
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

      const logger = this.logger;
      const productRepository = this.productRepository;

      const crawler = new PlaywrightCrawler({
        async requestHandler({ page, request }) {
          logger.log(`Processing category: ${request.url}`);
          
          await page.goto(request.url, { waitUntil: 'networkidle' });
          
          const products = await page.$$eval('.product, .book, .item', (elements) => {
            return elements.map(el => {
              const titleEl = el.querySelector('h3, .title, .name');
              const priceEl = el.querySelector('.price, .cost');
              const imageEl = el.querySelector('img');
              const linkEl = el.querySelector('a');
              
              return {
                title: titleEl?.textContent?.trim() || '',
                price: priceEl?.textContent?.trim() || '',
                image: imageEl?.getAttribute('src') || '',
                link: linkEl?.getAttribute('href') || '',
              };
            }).filter(item => item.title);
          });

          for (const product of products) {
            if (product.title && product.link) {
              const sourceId = this.extractSourceId(product.link);
              const price = this.extractPrice(product.price);
              
              await productRepository.upsert(
                {
                  source_id: sourceId,
                  title: product.title,
                  price,
                  currency: 'GBP',
                  image_url: product.image,
                  source_url: product.link,
                  category_id: categoryId,
                  last_scraped_at: new Date(),
                },
                ['source_id']
              );
            }
          }
        },
      });

      await crawler.run([category.source_url || '']);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return { success: true, message: 'Category scraped successfully' };
    } catch (error) {
      this.logger.error(`Category scraping failed: ${error.message}`);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      return { success: false, message: error.message };
    }
  }

  // ---------------------------------------
  // SCRAPE PRODUCT DETAILS
  // ---------------------------------------
  async scrapeProduct(productId: string): Promise<{ success: boolean; message: string }> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new Error('Product not found');
    }

    const job = await this.createScrapeJob(product.source_url, 'product');
    
    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);

      const logger = this.logger;
      const productRepository = this.productRepository;

      const crawler = new PlaywrightCrawler({
        async requestHandler({ page, request }) {
          logger.log(`Processing product: ${request.url}`);
          
          await page.goto(request.url, { waitUntil: 'networkidle' });
          
          const details = await page.evaluate(() => {
            const descriptionEl = document.querySelector('.description, .product-description, .summary');
            const specsEl = document.querySelector('.specifications, .details, .features');
            const reviewsEl = document.querySelectorAll('.review, .rating');
            
            return {
              description: descriptionEl?.textContent?.trim() || '',
              specs: specsEl?.textContent?.trim() || '',
              reviews: Array.from(reviewsEl).map(review => ({
                author: review.querySelector('.author, .reviewer')?.textContent?.trim() || '',
                rating: parseInt(review.querySelector('.rating')?.textContent || '0'),
                text: review.querySelector('.text, .content')?.textContent?.trim() || '',
              })),
            };
          });

          if (details.description) {
            await productRepository.update(productId, {
              last_scraped_at: new Date(),
            });
          }
        },
      });

      await crawler.run([product.source_url]);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED);
      
      return { success: true, message: 'Product scraped successfully' };
    } catch (error) {
      this.logger.error(`Product scraping failed: ${error.message}`);
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      return { success: false, message: error.message };
    }
  }

  // ---------------------------------------
  // HELPERS
  // ---------------------------------------
  private async createScrapeJob(targetUrl: string, targetType: string): Promise<ScrapeJob> {
    const job = this.scrapeJobRepository.create({
      target_url: targetUrl,
      target_type: targetType,
      status: ScrapeJobStatus.PENDING,
      started_at: new Date(),
    });
    return await this.scrapeJobRepository.save(job);
  }

  private async updateJobStatus(jobId: string, status: ScrapeJobStatus, errorLog?: string): Promise<void> {
    await this.scrapeJobRepository.update(jobId, {
      status,
      finished_at: status === ScrapeJobStatus.COMPLETED || status === ScrapeJobStatus.FAILED ? new Date() : undefined,
      error_log: errorLog,
    });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private extractSourceId(url: string): string {
    const match = url.match(/\/(\d+)/);
    return match ? match[1] : url.split('/').pop() || '';
  }

  private extractPrice(priceText: string): number {
    const match = priceText.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  }
}