import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('scraping') private scrapingQueue: Queue) {}

  async addScrapingJob(type: string, targetId: string, targetUrl: string) {
    return await this.scrapingQueue.add('scrape', {
      type,
      targetId,
      targetUrl,
    }, {
      delay: 2000, // 2 second delay
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }

  async getJobStatus(jobId: string) {
    const job = await this.scrapingQueue.getJob(jobId);
    if (!job) {
      return null;
    }

    return {
      id: job.id,
      data: job.data,
      progress: job.progress(),
      state: await job.getState(),
      createdAt: new Date(job.timestamp),
      processedOn: job.processedOn ? new Date(job.processedOn) : null,
      finishedOn: job.finishedOn ? new Date(job.finishedOn) : null,
    };
  }

  async getQueueStats() {
    const waiting = await this.scrapingQueue.getWaiting();
    const active = await this.scrapingQueue.getActive();
    const completed = await this.scrapingQueue.getCompleted();
    const failed = await this.scrapingQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }
}