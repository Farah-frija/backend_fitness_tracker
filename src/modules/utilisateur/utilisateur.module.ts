import { forwardRef, Module } from '@nestjs/common';

import { Utilisateur } from './entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../forum/entities/post.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])],

  
})
export class UtilisateurModule {}
