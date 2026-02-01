// src/modules/forum/controllers/reaction.controller.ts
import {
  Controller,
  Post,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ReactionService } from '../services/reaction.service';
import { CreateReactionDto } from '../dtos/createReactionDto';
import { Reaction } from '../entities/reaction.entity';

@ApiTags('reactions')
@ApiBearerAuth()
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  // ➕ Add reaction
  @Post()
  @ApiOperation({
    summary: 'Ajouter une réaction à un post',
    description: 'Ajoute une réaction (LIKE, SHARE, PIN) à un post',
  })
  @ApiBody({ type: CreateReactionDto })
  @ApiCreatedResponse({
    description: 'Réaction ajoutée avec succès',
    type: Reaction,
  })
  @ApiBadRequestResponse({ description: 'Réaction déjà existante' })
  @ApiNotFoundResponse({ description: 'Utilisateur ou post non trouvé' })
  @UsePipes(new ValidationPipe({ transform: true }))
  addReaction(@Body() dto: CreateReactionDto) {
    return this.reactionService.addReaction(dto);
  }

  // ➖ Remove reaction
  @Delete()
  @ApiOperation({
    summary: 'Supprimer une réaction',
    description: 'Supprime une réaction existante d’un post',
  })
 // src/modules/forum/controllers/reaction.controller.ts
@Delete(':id')
@ApiOperation({
  summary: 'Supprimer une réaction',
  description: 'Supprime une réaction par son ID',
})
@ApiParam({
  name: 'id',
  type: Number,
  description: 'ID de la réaction',
  example: 1,
})
@ApiOkResponse({ description: 'Réaction supprimée avec succès' })
@ApiNotFoundResponse({ description: 'Réaction non trouvée' })
removeReaction(@Param('id') id: number) {
  return this.reactionService.removeReactionById(id);
}

}
