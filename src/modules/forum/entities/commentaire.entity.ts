import { Entity, Column, ManyToOne, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../forum/entities/post.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('commentaire')
export class Comment extends BaseEntity {
  @Column()
  content: string;

  // Link to the post this comment belongs to
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  // Link to the user who wrote the comment
  @ManyToOne(() => Utilisateur, (user) => user.comments, { eager: true })
  author: Utilisateur;

  // Self-referencing relation for replies
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];
  @Column({ default: false })
  isSolution: boolean;
  @CreateDateColumn()
  createdAt: Date;
@UpdateDateColumn()
updatedAt: Date;
 @PrimaryGeneratedColumn()
  id: number; // ⬅️ Auto-generated ID for each comment

}

