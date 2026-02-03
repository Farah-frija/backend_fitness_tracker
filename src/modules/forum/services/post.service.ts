// src/modules/forum/services/post.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dtos/createPostDto';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { CategoriesType } from '../../../common/enums/category.enum';
import { PostWithReactionsDto } from '../dtos/postResponseDto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Vérifier si l'utilisateur existe
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: createPostDto.userId },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Créer le post
    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      category: createPostDto.category,
      tags: createPostDto.tags || [],
      author: utilisateur,
    });

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      // Gérer les erreurs spécifiques
      if (error.code === '23505') {
        // Erreur de contrainte unique (par exemple, titre dupliqué)
        throw new BadRequestException('Un post avec ce titre existe déjà');
      }
      throw error;
    }
  }

  // Méthodes supplémentaires (optionnelles)
async findAll(userId: number): Promise<PostWithReactionsDto[]> {
  const posts = await this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.author', 'author')

    // COUNTS
    .addSelect(
      `COUNT(CASE WHEN reaction.type = 'LIKE' THEN 1 END)`,
      'likes',
    )
    .addSelect(
      `COUNT(CASE WHEN reaction.type = 'SHARE' THEN 1 END)`,
      'shares',
    )
    .addSelect(
      `COUNT(CASE WHEN reaction.type = 'PIN' THEN 1 END)`,
      'pins',
    )

    // BOOLS (user specific)
    .addSelect(
      `MAX(CASE WHEN reaction.type = 'LIKE' AND reaction.userId = :userId THEN 1 ELSE 0 END)`,
      'isLiked',
    )
    .addSelect(
      `MAX(CASE WHEN reaction.type = 'SHARE' AND reaction.userId = :userId THEN 1 ELSE 0 END)`,
      'isShared',
    )
    .addSelect(
      `MAX(CASE WHEN reaction.type = 'PIN' AND reaction.userId = :userId THEN 1 ELSE 0 END)`,
      'isPinned',
    )

    .leftJoin('post.reactions', 'reaction')
    .groupBy('post.id')
    .addGroupBy('author.id')
    .orderBy('post.createdAt', 'DESC')
    .setParameter('userId', userId)
    .getRawAndEntities();

  // 🔄 Merge raw + entities
  return posts.entities.map((post, index) => ({
    ...post,
    likes: Number(posts.raw[index].likes),
    shares: Number(posts.raw[index].shares),
    pins: Number(posts.raw[index].pins),
    isLiked: Boolean(posts.raw[index].isLiked),
    isShared: Boolean(posts.raw[index].isShared),
    isPinned: Boolean(posts.raw[index].isPinned),
  }));
}


async findOne(
  id: number,
  userId: number,
): Promise<PostWithReactionsDto> {
  const result = await this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.author', 'author')
    .leftJoin('post.reactions', 'reaction')

    // counts
    .addSelect(
      `COUNT(CASE WHEN reaction.type = 'LIKE' THEN 1 END)`,
      'likes',
    )
    .addSelect(
      `COUNT(CASE WHEN reaction.type = 'SHARE' THEN 1 END)`,
      'shares',
    )
    .addSelect(
      `COUNT(CASE WHEN reaction.type = 'PIN' THEN 1 END)`,
      'pins',
    )

    // user booleans
    .addSelect(
      `MAX(CASE WHEN reaction.type = 'LIKE' AND reaction.userId = :userId THEN 1 ELSE 0 END)`,
      'isLiked',
    )
    .addSelect(
      `MAX(CASE WHEN reaction.type = 'SHARE' AND reaction.userId = :userId THEN 1 ELSE 0 END)`,
      'isShared',
    )
    .addSelect(
      `MAX(CASE WHEN reaction.type = 'PIN' AND reaction.userId = :userId THEN 1 ELSE 0 END)`,
      'isPinned',
    )

    .where('post.id = :id', { id })
    .andWhere('post.deletedAt IS NULL')
    .groupBy('post.id')
    .addGroupBy('author.id')
    .setParameter('userId', userId)
    .getRawAndEntities();

  if (!result.entities.length) {
    throw new NotFoundException(`Post avec ID ${id} non trouvé`);
  }

  // ✅ Post intact + champs ajoutés
  const post = result.entities[0] as PostWithReactionsDto;

  post.likes = Number(result.raw[0].likes);
  post.shares = Number(result.raw[0].shares);
  post.pins = Number(result.raw[0].pins);

  post.isLiked = Boolean(result.raw[0].isLiked);
  post.isShared = Boolean(result.raw[0].isShared);
  post.isPinned = Boolean(result.raw[0].isPinned);

  return post;
}


  async findByUser(userId: number): Promise<Post[]> {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: userId },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.postRepository.find({
      where: { author: { id: userId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: CategoriesType): Promise<Post[]> {
    return this.postRepository.find({
      where: { category },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTag(tag: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.tags LIKE :tag', { tag: `%${tag}%` })
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }
}