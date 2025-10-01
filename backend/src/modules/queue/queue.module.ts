// import { Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bull';
// import { QueueService } from './queue.service';
// import { ScrapingProcessor } from './scraping.processor';
// import { ScrapingModule } from '../scraping/scraping.module';

// @Module({
//   imports: [
//     BullModule.registerQueue({
//       name: 'scraping',
//     }),
//   ],
//   providers: [QueueService, ScrapingProcessor],
//   exports: [QueueService],
// })
// export class QueueModule {}


import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScrapingProcessor } from './scraping.processor';
import { ScrapingModule } from '../scraping/scraping.module';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scraping',
    }),
    ScrapingModule, // ✅ import it here
  ],
  providers: [QueueService, ScrapingProcessor],
  exports: [QueueService],
  
})
export class QueueModule {}
