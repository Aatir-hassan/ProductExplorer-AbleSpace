import { IsOptional, IsUUID, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCategoriesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  navigation_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  parent_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  limit?: number;
}