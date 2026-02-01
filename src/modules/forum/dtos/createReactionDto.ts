// src/modules/forum/dtos/create-reaction.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { ReactionType } from '../../../common/enums/Reaction.enum';

export class CreateReactionDto {
  @ApiProperty({ description: 'ID du post', example: 1 })
  @IsNumber()
  postId: number;

  @ApiProperty({ description: 'ID de l’utilisateur', example: 2 })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Type de réaction',
    enum: ReactionType,
    example: ReactionType.LIKE,
  })
  @IsEnum(ReactionType)
  type: ReactionType;
}
