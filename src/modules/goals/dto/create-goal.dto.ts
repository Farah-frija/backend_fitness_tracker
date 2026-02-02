import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Titre du but' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Description du but' })
  description?: string;

  @IsString()
  @ApiProperty({ description: 'Type de but (walking, water, custom)' })
  goalType: string;

  @IsString()
  @ApiProperty({ description: 'Metric type (duration, count, volume, binary)' })
  metricType: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Valeur cible (ex: 30 minutes, 2000 ml)' })
  targetValue?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Unité de la cible (minutes, ml, times)' })
  unit?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date de début (YYYY-MM-DD)' })
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date de fin (YYYY-MM-DD)' })
  endDate?: Date;

  // Schedule (optional) — helps create recurring goals
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'Schedule frequency type. Example: "daily", "weekly", "monthly". Leave empty for one-off goals.',
    example: 'daily',
  })
  frequencyType?: string;



  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiPropertyOptional({
    description:
      'For weekly schedules: array of numbers representing days of week (0=Sunday, 1=Monday, ... 6=Saturday).',
    example: [1, 3, 5],
    type: [Number],
  })
  daysOfWeek?: number[];
}
