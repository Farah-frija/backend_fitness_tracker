// src/modules/forum/controllers/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/createPostDto';
import { Post as PostEntity } from '../entities/post.entity';

@ApiTags('posts') // Groupe tous les endpoints sous /posts
@ApiBearerAuth() // Indique que l'authentification est requise
@ApiExtraModels(CreatePostDto) // ← AJOUTER CETTE LIGNE
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer un nouveau post',
    description: 'Crée un nouveau post avec les informations fournies'
  })
  @ApiBody({ 
    type: CreatePostDto,
    description: 'Données nécessaires pour créer un post'
  })
  @ApiCreatedResponse({ 
    description: 'Post créé avec succès',
    type: PostEntity 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides ou titre déjà utilisé' 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer tous les posts',
    description: 'Retourne la liste de tous les posts'
  })
  @ApiOkResponse({ 
    description: 'Liste des posts récupérée avec succès',
    type: [PostEntity] 
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite le nombre de résultats'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page pour la pagination'
  })
  findAll(
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un post par ID',
    description: 'Retourne les détails d\'un post spécifique'
  })
  @ApiParam({
    name: 'id',
    description: 'ID du post à récupérer',
    type: Number
  })
  @ApiOkResponse({ 
    description: 'Post récupéré avec succès',
    type: PostEntity 
  })
  @ApiNotFoundResponse({ 
    description: 'Post non trouvé' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Récupérer les posts d\'un utilisateur',
    description: 'Retourne tous les posts créés par un utilisateur spécifique'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID de l\'utilisateur',
    type: Number
  })
  @ApiOkResponse({ 
    description: 'Posts de l\'utilisateur récupérés avec succès',
    type: [PostEntity] 
  })
  @ApiNotFoundResponse({ 
    description: 'Utilisateur non trouvé' 
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.findByUser(userId);
  }

  @Get('category/:category')
  @ApiOperation({ 
    summary: 'Récupérer les posts par catégorie',
    description: 'Retourne tous les posts d\'une catégorie spécifique'
  })
  @ApiParam({
    name: 'category',
    description: 'Catégorie des posts',
    enum: ['FITNESS', 'NUTRITION', 'WORKOUT', 'WELLNESS'] // Adaptez selon votre enum
  })
  @ApiOkResponse({ 
    description: 'Posts de la catégorie récupérés avec succès',
    type: [PostEntity] 
  })
  findByCategory(@Param('category') category: string) {
    return this.postService.findByCategory(category as any);
  }

  @Get('tag/:tag')
  @ApiOperation({ 
    summary: 'Récupérer les posts par tag',
    description: 'Retourne tous les posts contenant un tag spécifique'
  })
  @ApiParam({
    name: 'tag',
    description: 'Tag à rechercher',
    type: String
  })
  @ApiOkResponse({ 
    description: 'Posts avec le tag récupérés avec succès',
    type: [PostEntity] 
  })
  findByTag(@Param('tag') tag: string) {
    return this.postService.findByTag(tag);
  }

  @Get('search/:keyword')
  @ApiOperation({ 
    summary: 'Rechercher des posts',
    description: 'Recherche des posts par mot-clé dans le titre ou le contenu'
  })
  @ApiParam({
    name: 'keyword',
    description: 'Mot-clé à rechercher',
    type: String
  })
  @ApiOkResponse({ 
    description: 'Résultats de la recherche',
    type: [PostEntity] 
  })
  @ApiQuery({
    name: 'inTitle',
    required: false,
    type: Boolean,
    description: 'Rechercher uniquement dans les titres'
  })
  searchByKeyword(
    @Param('keyword') keyword: string,
    @Query('inTitle') inTitle?: boolean
  ) {
    // Vous pouvez ajouter cette méthode dans votre service si besoin
    // return this.postService.searchByKeyword(keyword, inTitle);
    return this.postService.findAll(); // Temporaire
  }
}