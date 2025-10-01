import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { Navigation } from '../../entities/navigation.entity';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { ScrapeJob } from '../../entities/scrape-job.entity';
import { Review } from '@/entities/review.entity';
import { ProductDetail } from '@/entities/product-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Navigation,
      Category,
      Product,
      ProductDetail,  
      Review,         
      ScrapeJob,
    ]),
  ],
  controllers: [ScrapingController],
  providers: [
    ScrapingService,
    NavigationService,
    CategoryService,
    ProductService,
  ],
  exports: [ScrapingService, ProductService], // export ProductService if other modules need it
})
export class ScrapingModule {}
