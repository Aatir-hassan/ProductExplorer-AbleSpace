import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { Navigation } from '../../entities/navigation.entity';
import { ApiResponseDto } from '../../dto/api-response.dto';

@ApiTags('navigation')
@Controller('api/navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all navigation items' })
  @ApiResponse({ status: 200, description: 'Navigation items retrieved successfully' })
  async findAll(): Promise<ApiResponseDto<Navigation[]>> {
    try {
      return await this.navigationService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get navigation item by ID' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Navigation item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<Navigation>> {
    try {
      return await this.navigationService.findOne(id);
    } catch (error) {
      if (error.message === 'Navigation not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new navigation item' })
  @ApiResponse({ status: 201, description: 'Navigation item created successfully' })
  async create(@Body() createNavigationDto: Partial<Navigation>): Promise<ApiResponseDto<Navigation>> {
    try {
      return await this.navigationService.create(createNavigationDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update navigation item' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Navigation item updated successfully' })
  async update(@Param('id') id: string, @Body() updateNavigationDto: Partial<Navigation>): Promise<ApiResponseDto<Navigation>> {
    try {
      return await this.navigationService.update(id, updateNavigationDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete navigation item' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Navigation item deleted successfully' })
  async delete(@Param('id') id: string): Promise<ApiResponseDto<boolean>> {
    try {
      return await this.navigationService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}