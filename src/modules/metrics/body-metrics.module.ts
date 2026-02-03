import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyMetrics } from './entities/body-metrics.entity';
import { BodyMetricsController } from './contollers/body-metrics.controller';
import { BodyMetricsService } from './services/body-metrics.service';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import { UtilisateurModule } from '../utilisateur/utilisateur.module';


@Module({
  imports: [TypeOrmModule.forFeature([BodyMetrics, Utilisateur]), UtilisateurModule],
  controllers: [BodyMetricsController],
  providers: [BodyMetricsService],
})
export class BodyMetricsModule {}
