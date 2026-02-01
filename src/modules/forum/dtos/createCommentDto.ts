import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Contenu du commentaire' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID de l’utilisateur qui poste le commentaire' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'ID du post auquel le commentaire appartient' })
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ApiProperty({ description: 'ID du commentaire parent (optionnel, si c’est une réponse)', required: false })
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;
}