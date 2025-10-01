import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { Review } from '../../entities/review.entity';
import { PaginationDto } from '../../dto/pagination.dto';
import { PaginatedResponseDto } from '../../dto/api-response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findAll(
    pagination: PaginationDto,
    categoryId?: string,
    search?: string,
  ): Promise<PaginatedResponseDto<Product>> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      if (categoryId) {
        queryBuilder.andWhere('product.category_id = :categoryId', { categoryId });
      }

      if (search) {
        queryBuilder.andWhere('product.title ILIKE :search', { search: `%${search}%` });
      }

      const [products, total] = await queryBuilder
        .orderBy('product.created_at', 'DESC')
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit)
        .getManyAndCount();

      return new PaginatedResponseDto(
        products,
        total,
        pagination.page,
        pagination.limit,
      );
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Product & { detail?: ProductDetail; reviews?: Review[] }> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'detail'],
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const reviews = await this.reviewRepository.find({
        where: { product_id: id },
        order: { created_at: 'DESC' },
      });

      return {
        ...product,
        reviews,
      };
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  async create(data: Partial<Product>): Promise<Product> {
    try {
      const product = this.productRepository.create(data);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      await this.productRepository.update(id, data);
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.productRepository.delete(id);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async updateLastScraped(id: string): Promise<void> {
    await this.productRepository.update(id, {
      last_scraped_at: new Date(),
    });
  }

  async createOrUpdateDetail(productId: string, data: Partial<ProductDetail>): Promise<ProductDetail> {
    try {
      const existingDetail = await this.productDetailRepository.findOne({
        where: { product_id: productId },
      });

      if (existingDetail) {
        await this.productDetailRepository.update(existingDetail.id, data);
        return await this.productDetailRepository.findOne({ where: { id: existingDetail.id } });
      } else {
        const detail = this.productDetailRepository.create({
          product_id: productId,
          ...data,
        });
        return await this.productDetailRepository.save(detail);
      }
    } catch (error) {
      throw new Error(`Failed to create/update product detail: ${error.message}`);
    }
  }
}