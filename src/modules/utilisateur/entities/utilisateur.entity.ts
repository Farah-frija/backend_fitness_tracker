import { Entity, Column, TableInheritance, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

import { Post } from '../../forum/entities/post.entity'
import { Comment } from '../../forum/entities/commentaire.entity'
import { Reaction } from '../../forum/entities/reaction.entity';
import { BodyMetrics } from '../../metrics/entities/body-metrics.entity';
import { Goal } from '../../goals/entities/goal.entity';

@Entity('utilisateur')
@TableInheritance({ column: { type: 'varchar', name: 'type', default: 'Utilisateur' } })
export class Utilisateur extends BaseEntity {
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  motDePasse: string;

  @Column()
  gender: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => BodyMetrics, (metrics) => metrics.user)
  metrics: BodyMetrics[];

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  estVerifie: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  @Exclude()
  verificationToken: string;

  @Column({ nullable: true })
  verificationExpires: Date;

  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.author)
comments: Comment[];

@OneToMany(() => Goal, (goal) => goal.user)
goals: Goal[];

}