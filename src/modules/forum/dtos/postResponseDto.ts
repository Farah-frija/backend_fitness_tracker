// src/modules/forum/dtos/post-with-reactions.dto.ts
import { Post } from '../entities/post.entity';

export class PostWithReactionsDto extends Post {
  likes: number;
  shares: number;
  pins: number;

  isLiked: boolean;
  isShared: boolean;
  isPinned: boolean;
}
