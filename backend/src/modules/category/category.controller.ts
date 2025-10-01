import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from '../../entities/category.entity';
import { PaginationDto } from '../../dto/pagination.dto';
import { PaginatedResponseDto } from '../../dto/api-response.dto';

@ApiTags('categories')
@Controller('api/categories')
  
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiQuery({ name: 'navigation_id', required: false, description: 'Filter by navigation ID' })
  @ApiQuery({ name: 'parent_id', required: false, description: 'Filter by parent category ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('navigation_id') navigationId?: string,
    @Query('parent_id') parentId?: string,
  ): Promise<PaginatedResponseDto<Category>> {
    try {
      return await this.categoryService.findAll(pagination, navigationId, parentId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      if (error.message === 'Category not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createCategoryDto: Partial<Category>): Promise<Category> {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: Partial<Category>): Promise<Category> {
    try {
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    try {
      await this.categoryService.delete(id);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}