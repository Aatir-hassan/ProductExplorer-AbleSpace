import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../entities/navigation.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Review } from '../entities/review.entity';
import { ScrapeJob } from '../entities/scrape-job.entity';
import { ViewHistory } from '../entities/view-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Navigation,
      Category,
      Product,
      ProductDetail,
      Review,
      ScrapeJob,
      ViewHistory,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}