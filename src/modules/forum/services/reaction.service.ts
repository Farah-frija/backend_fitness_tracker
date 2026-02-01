// src/modules/forum/services/reaction.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../entities/reaction.entity';
import { Post } from '../entities/post.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { CreateReactionDto } from '../dtos/createReactionDto';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Utilisateur)
    private userRepository: Repository<Utilisateur>,
  ) {}

  // ➕ Add reaction
  async addReaction(dto: CreateReactionDto): Promise<Reaction> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const post = await this.postRepository.findOne({
      where: { id: dto.postId },
    });
    if (!post) throw new NotFoundException('Post non trouvé');

    // Check if reaction already exists
    const existing = await this.reactionRepository.findOne({
      where: {
        user: { id: dto.userId },
        post: { id: dto.postId },
        type: dto.type,
      },
    });

    if (existing) {
      throw new BadRequestException('Cette réaction existe déjà');
    }

    const reaction = this.reactionRepository.create({
      user,
      post,
      type: dto.type,
    });

    return this.reactionRepository.save(reaction);
  }

  // ➖ Remove reaction
// ➖ Remove reaction by ID
async removeReactionById(reactionId: number): Promise<{ message: string }> {
  const reaction = await this.reactionRepository.findOne({
    where: { id: reactionId },
  });

  if (!reaction) {
    throw new NotFoundException('Réaction non trouvée');
  }

  await this.reactionRepository.remove(reaction);

  return { message: 'Réaction supprimée avec succès' };
}

}
