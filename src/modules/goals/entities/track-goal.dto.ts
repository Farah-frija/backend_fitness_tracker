import { IsNumber, IsOptional } from 'class-validator';

export class TrackGoalDto {
  @IsOptional()
  @IsNumber()
  value?: number; // increment/decrement value
}
