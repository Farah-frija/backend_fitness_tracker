import { forwardRef, Module } from '@nestjs/common';


import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../forum/entities/post.entity'
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import {Comment} from './entities/commentaire.entity'
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { Reaction } from './entities/reaction.entity';
import { ReactionController } from './controllers/reaction.controller';
import { ReactionService } from './services/reaction.service';
@Module({
  imports: [  TypeOrmModule.forFeature([
      Post,
      Utilisateur,
      Comment,
      Reaction// Important pour la relation
    ]),],
      controllers: [PostController,CommentController,ReactionController], // Retirez si vous n'en avez pas besoin
  providers: [PostService,CommentService,ReactionService],
  exports: [PostService,CommentService,ReactionService],
 
})
export class ForumModule {}
