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
  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id, deletedAt: null } as any,
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post avec ID ${id} non trouvé`);
    }

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