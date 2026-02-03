import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodyMetrics } from '../entities/body-metrics.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { CreateBodyMetricsDto } from '../dtos/create-body-metrics.dto';
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';

@Injectable()
export class BodyMetricsService {
  constructor(
    @InjectRepository(BodyMetrics)
    private readonly metricsRepo: Repository<BodyMetrics>,
private readonly utilisateurService: UtilisateurService,
  ) {}

  async create(userId: number, dto: CreateBodyMetricsDto): Promise<BodyMetrics> {
    const user = await this.utilisateurService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const metrics = this.metricsRepo.create({
      ...dto,
      user,
    });

    return this.metricsRepo.save(metrics);
  }

  async findAllForUser(userId: number): Promise<BodyMetrics[]> {
    return this.metricsRepo.find({
      where: { user: { id: userId } },
      order: { recordedAt: 'ASC' },
    });
  }
}
