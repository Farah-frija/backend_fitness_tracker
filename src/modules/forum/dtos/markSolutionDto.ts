import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarkSolutionDto {
  @ApiProperty({ description: 'ID du commentaire à marquer comme solution' })
  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}