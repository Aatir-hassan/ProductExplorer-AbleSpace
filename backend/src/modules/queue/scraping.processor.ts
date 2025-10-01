import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ScrapingService } from '../scraping/scraping.service';

@Processor('scraping')
export class ScrapingProcessor {
  private readonly logger = new Logger(ScrapingProcessor.name);

  constructor(private readonly scrapingService: ScrapingService) {}

  @Process('scrape')
  async handleScraping(job: Job<{ type: string; targetId: string; targetUrl: string }>) {
    this.logger.log(`Processing scraping job: ${job.id}`);
    
    try {
      const { type, targetId, targetUrl } = job.data;
      
      switch (type) {
        case 'navigation':
          return await this.scrapingService.scrapeNavigation();
        case 'category':
          return await this.scrapingService.scrapeCategory(targetId);
        case 'product':
          return await this.scrapingService.scrapeProduct(targetId);
        default:
          throw new Error(`Unknown scraping type: ${type}`);
      }
    } catch (error) {
      this.logger.error(`Scraping job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}