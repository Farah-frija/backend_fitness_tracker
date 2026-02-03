import { IsNumber, IsOptional } from 'class-validator';

export class CreateBodyMetricsDto {
  @IsNumber()
  heightCm: number;

  @IsNumber()
  weightKg: number;

  @IsNumber()
  bmi: number;

  @IsOptional()
  @IsNumber()
  bodyFat?: number;

  @IsOptional()
  @IsNumber()
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  neckCm?: number;

  @IsOptional()
  @IsNumber()
  hipCm?: number;

  @IsOptional()
  @IsNumber()
  systolic?: number;

  @IsOptional()
  @IsNumber()
  diastolic?: number;

  @IsOptional()
  @IsNumber()
  pulseRate?: number;
}
