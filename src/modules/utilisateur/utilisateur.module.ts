import { forwardRef, Module } from '@nestjs/common';
import { Utilisateur } from './entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from '../forum/entities/post.entity'
import { UtilisateurService } from './services/utilisateur.service';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])],
  providers: [UtilisateurService],
  exports: [UtilisateurService], 
})
export class UtilisateurModule {}
