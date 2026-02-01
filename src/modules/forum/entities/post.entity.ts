// src/modules/posts/entities/post.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,

} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import {Comment} from './commentaire.entity'

import { CategoriesType } from '../../../common/enums/category.enum';
import { Reaction } from './reaction.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @ApiProperty({ description: 'ID unique du post', example: 1 })
  id: number;

  @ApiProperty({ 
    description: 'Auteur du post',
    type: () => Utilisateur 
  })
  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.posts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  author: Utilisateur;

  @ApiProperty({ 
    description: 'Catégorie du post',
    enum: CategoriesType,
    example: CategoriesType.NUTRITION
  })
  @Column({ name: 'category', nullable: false })
  category: CategoriesType;

  @ApiProperty({ 
    description: 'Titre du post',
    example: 'Mon premier article sur le fitness'
  })
  @Column()
  title: string;

  @ApiProperty({ 
    description: 'Contenu du post',
    example: 'Contenu détaillé...'
  })
  @Column('text')
  content: string;

  @ApiProperty({ 
    description: 'Post verrouillé',
    example: false,
    default: false
  })
  @Column({ name: 'is_locked', default: false })
  isLocked: boolean;

  @ApiProperty({ 
    description: 'Tags associés au post',
    example: ['fitness', 'santé'],
    type: [String],
    required: false
  })
  @Column({
    type: 'simple-array',
    nullable: true,
    default: '',
  })
  tags: string[];

  @ApiProperty({ 
    description: 'Date de création',
    example: '2024-01-01T12:00:00.000Z'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Date de mise à jour',
    example: '2024-01-01T12:00:00.000Z'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
@OneToMany(() => Comment, (comment) => comment.post)
comments: Comment[];
@OneToMany(() => Reaction, (reaction) => reaction.post)
reactions: Reaction[];


}