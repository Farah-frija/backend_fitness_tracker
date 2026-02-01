// src/modules/forum/dtos/createPostDto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriesType } from '../../../common/enums/category.enum';

export class CreatePostDto {
  @ApiProperty({
    description: 'Titre du post',
    example: 'Mon premier article sur le fitness',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Contenu du post',
    example: 'Contenu détaillé de mon article sur les bienfaits du sport...'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Catégorie du post',
    enum: CategoriesType,
    example: CategoriesType.NUTRITION
  })
  @IsEnum(CategoriesType)
  @IsNotEmpty()
  category: CategoriesType;

  @ApiPropertyOptional({
    description: 'Liste de tags',
    example: ['fitness', 'santé', 'nutrition'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'ID de l\'utilisateur créateur',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}