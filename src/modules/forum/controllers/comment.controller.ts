// src/modules/forum/controllers/comment.controller.ts
import { Controller, Post, Body, Param, Get, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dtos/createCommentDto';
import { MarkSolutionDto } from '../dtos/markSolutionDto';
import { Comment } from '../entities/commentaire.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Créer un commentaire' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ description: 'Commentaire créé avec succès', type: Comment })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Post('solution')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Marquer un commentaire comme solution' })
  @ApiBody({ type: MarkSolutionDto })
  @ApiOkResponse({ description: 'Commentaire marqué comme solution', type: Comment })
  @ApiBadRequestResponse({ description: 'Le commentaire ne peut pas être marqué comme solution' })
  @ApiNotFoundResponse({ description: 'Commentaire non trouvé' })
  markAsSolution(@Body() dto: MarkSolutionDto) {
    return this.commentService.markAsSolution(dto.commentId);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Récupérer tous les commentaires d’un post' })
  @ApiParam({ name: 'postId', type: Number })
  @ApiOkResponse({ description: 'Commentaires récupérés', type: [Comment] })
  @ApiNotFoundResponse({ description: 'Post non trouvé' })
  getCommentsByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.getCommentsByPost(postId);
  }
}
