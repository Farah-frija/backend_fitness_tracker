// src/modules/forum/entities/reaction.entity.ts
import {
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { ReactionType } from '../../../common/enums/Reaction.enum'

@Entity('reaction')
@Unique(['user', 'post', 'type']) // ⬅️ important
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Utilisateur, (user) => user.reactions, { onDelete: 'CASCADE' })
  user: Utilisateur;

  @ManyToOne(() => Post, (post) => post.reactions, { onDelete: 'CASCADE' })
  post: Post;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @CreateDateColumn()
  createdAt: Date;
}
