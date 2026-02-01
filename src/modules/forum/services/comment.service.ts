// src/modules/forum/services/comment.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/commentaire.entity';
import { CreateCommentDto } from '.././dtos/createCommentDto';
import { Post } from '../entities/post.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Utilisateur)
    private userRepository: Repository<Utilisateur>,
  ) {}

  // Create comment
  async create(dto: CreateCommentDto): Promise<Comment> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const post = await this.postRepository.findOne({ where: { id: dto.postId } });
    if (!post) throw new NotFoundException('Post non trouvé');

    let parentComment: Comment = null;
    if (dto.parentCommentId) {
      parentComment = await this.commentRepository.findOne({ where: { id: dto.parentCommentId } });
      if (!parentComment) throw new NotFoundException('Commentaire parent non trouvé');
    }

    const comment = this.commentRepository.create({
      content: dto.content,
      author: user,
      post,
      parentComment,
    });

    return this.commentRepository.save(comment);
  }

// Mark comment as solution (toggle)
async markAsSolution(commentId: number): Promise<Comment> {
  const comment = await this.commentRepository.findOne({
    where: { id: commentId } as any,
    relations: ['parentComment'],
  });

  if (!comment) throw new NotFoundException('Commentaire non trouvé');

  if (comment.parentComment)
    throw new BadRequestException("Un commentaire enfant ne peut pas être marqué comme solution");

  // Toggle the isSolution flag
  comment.isSolution = !comment.isSolution;


  return this.commentRepository.save(comment);
}



  // Fetch comments for a post recursively
async getCommentsByPost(postId: number): Promise<any[]> {
  // 1️⃣ Ensure post exists
  const postExists = await this.postRepository.findOne({
    where: { id: postId },
  });

  if (!postExists) {
    throw new NotFoundException('Post non trouvé');
  }

  // 2️⃣ Fetch ALL comments of the post directly
  const comments = await this.commentRepository.find({
    where: {
      post: { id: postId },
    },
    relations: ['author', 'parentComment'], // 🔥 THIS is key
    order: { createdAt: 'ASC' },
  });

  // 3️⃣ Recursive tree builder
  const buildTree = (parentId: number | null): any[] =>
    comments
      .filter(c => (c.parentComment?.id ?? null) === parentId)
      .map(c => ({
        id: c.id,
        content: c.content,
        author: {
          id: c.author.id,
          nom: c.author.nom,
          prenom: c.author.prenom,
          email: c.author.email,
        },
        postId,
        parentCommentId: parentId,
        createdAt: c.createdAt,
        likes: 0,
        isSolution: c.isSolution,
        replies: buildTree(c.id),
      }));

  // 4️⃣ Return only top-level comments
  return buildTree(null);
}

}
