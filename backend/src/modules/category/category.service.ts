import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { PaginationDto } from '../../dto/pagination.dto';
import { PaginatedResponseDto } from '../../dto/api-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    pagination: PaginationDto,
    navigationId?: string,
    parentId?: string,
  ): Promise<PaginatedResponseDto<Category>> {
    try {
      const queryBuilder = this.categoryRepository.createQueryBuilder('category');

      if (navigationId) {
        queryBuilder.andWhere('category.navigation_id = :navigationId', { navigationId });
      }

      if (parentId) {
        queryBuilder.andWhere('category.parent_id = :parentId', { parentId });
      } else if (parentId === null) {
        queryBuilder.andWhere('category.parent_id IS NULL');
      }

      const [categories, total] = await queryBuilder
        .orderBy('category.title', 'ASC')
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit)
        .getManyAndCount();

      return new PaginatedResponseDto(
        categories,
        total,
        pagination.page,
        pagination.limit,
      );
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['navigation', 'parent', 'children', 'products'],
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  async create(data: Partial<Category>): Promise<Category> {
    try {
      const category = this.categoryRepository.create(data);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    try {
      await this.categoryRepository.update(id, data);
      return await this.categoryRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.categoryRepository.delete(id);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  async updateLastScraped(id: string): Promise<void> {
    await this.categoryRepository.update(id, {
      last_scraped_at: new Date(),
    });
  }

  async updateProductCount(id: string, count: number): Promise<void> {
    await this.categoryRepository.update(id, {
      product_count: count,
    });
  }
}