//

import { Controller, Post, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScrapingService } from './scraping.service';

@ApiTags('scraping')
@Controller('api/scrape')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('navigation')
  @ApiOperation({ summary: 'Trigger navigation scraping' })
  @ApiResponse({ status: 200, description: 'Navigation scraping triggered successfully' })
  async scrapeNavigation(): Promise<{ success: boolean; message: string }> {
    try {
      return await this.scrapingService.scrapeNavigation();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ---------------------------------
  // NEW: SCRAPE CATEGORIES BY NAVIGATION
  // ---------------------------------
  @Post('categories-by-navigation/:id')
  @ApiOperation({ summary: 'Trigger category scraping for a navigation menu item' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Categories scraping triggered successfully' })
  async scrapeCategoriesByNavigation(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.scrapingService.scrapeCategoriesByNavigation(id);
    } catch (error) {
      if (error.message === 'Navigation not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('category/:id')
  @ApiOperation({ summary: 'Trigger category scraping' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category scraping triggered successfully' })
  async scrapeCategory(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.scrapingService.scrapeCategory(id);
    } catch (error) {
      if (error.message === 'Category not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('product/:id')
  @ApiOperation({ summary: 'Trigger product scraping' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product scraping triggered successfully' })
  async scrapeProduct(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.scrapingService.scrapeProduct(id);
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}