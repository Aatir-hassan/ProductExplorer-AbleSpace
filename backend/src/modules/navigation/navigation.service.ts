import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../../entities/navigation.entity';
import { ApiResponseDto } from '../../dto/api-response.dto';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
  ) {}

  async findAll(): Promise<ApiResponseDto<Navigation[]>> {
    try {
      const navigations = await this.navigationRepository.find({
        order: { created_at: 'ASC' },
      });
      return new ApiResponseDto(true, navigations);
    } catch (error) {
      throw new Error(`Failed to fetch navigation: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<ApiResponseDto<Navigation>> {
    try {
      const navigation = await this.navigationRepository.findOne({
        where: { id },
        relations: ['categories'],
      });

      if (!navigation) {
        throw new Error('Navigation not found');
      }

      return new ApiResponseDto(true, navigation);
    } catch (error) {
      throw new Error(`Failed to fetch navigation: ${error.message}`);
    }
  }

  async create(data: Partial<Navigation>): Promise<ApiResponseDto<Navigation>> {
    try {
      const navigation = this.navigationRepository.create(data);
      const savedNavigation = await this.navigationRepository.save(navigation);
      return new ApiResponseDto(true, savedNavigation);
    } catch (error) {
      throw new Error(`Failed to create navigation: ${error.message}`);
    }
  }

  async update(id: string, data: Partial<Navigation>): Promise<ApiResponseDto<Navigation>> {
    try {
      await this.navigationRepository.update(id, data);
      const updatedNavigation = await this.navigationRepository.findOne({
        where: { id },
      });
      return new ApiResponseDto(true, updatedNavigation);
    } catch (error) {
      throw new Error(`Failed to update navigation: ${error.message}`);
    }
  }

  async delete(id: string): Promise<ApiResponseDto<boolean>> {
    try {
      await this.navigationRepository.delete(id);
      return new ApiResponseDto(true, true);
    } catch (error) {
      throw new Error(`Failed to delete navigation: ${error.message}`);
    }
  }

  async updateLastScraped(id: string): Promise<void> {
    await this.navigationRepository.update(id, {
      last_scraped_at: new Date(),
    });
  }
}