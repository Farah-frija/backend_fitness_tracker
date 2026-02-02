import { IsNumber, IsOptional, Min } from 'class-validator';

export class TrackGoalDto {
  @IsNumber()
  @Min(0.01) // prevents negative or zero increments
  value: number;
}
