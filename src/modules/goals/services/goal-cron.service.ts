import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { GoalInstanceGeneratorService } from './goal-instance-generator.service';

@Injectable()
export class GoalCronService {
  private readonly logger = new Logger(GoalCronService.name);

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepo: Repository<Goal>,
    private readonly instanceGenerator: GoalInstanceGeneratorService,
  ) {}

  // Runs every day at 01:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async generateDailyGoalInstances() {
    this.logger.log('Generating daily goal instances...');

    const goals = await this.goalRepo.find({
      where: { isActive: true },
      relations: ['user', 'schedule'],
    });

    for (const goal of goals) {
      // Skip ended goals
      if (goal.endDate && goal.endDate < new Date()) continue;

      await this.instanceGenerator.generateForGoal(goal);
    }

    this.logger.log(`Processed ${goals.length} goals`);
  }
}
