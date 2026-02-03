import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyGoalInstance } from '../entities/daily-goal-instance.entity';

@Injectable()
export class GoalTrackerService {
  constructor(
    @InjectRepository(DailyGoalInstance)
    private instanceRepo: Repository<DailyGoalInstance>,
  ) {}


  async getToday(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.instanceRepo.find({
      where: {
        user: { id: userId },
        date: today,
        isGoalActive: true,
      },
      relations: ['goal'],
      order: { createdAt: 'ASC' },
    });
  }

  // ------------------------
  // TRACKING
  // ------------------------

  async toggleBinary(instanceId: number, userId: number) {
    const instance = await this.instanceRepo.findOne({
      where: { id: instanceId },
      relations: ['goal', 'user'],
    });

    if (!instance) throw new NotFoundException();
    if (instance.user.id !== userId) throw new ForbiddenException();

    if (instance.goal.metricType !== 'binary') {
        console.log('here');
        console.log(instance.goal.metricType);
      throw new BadRequestException('Not a binary goal');
    }

    instance.isCompleted = !instance.isCompleted;
    instance.completedValue = instance.isCompleted ? 1 : 0;

    return this.instanceRepo.save(instance);
  }

  async increment(instanceId: number, userId: number, value = 1) {
    const instance = await this.instanceRepo.findOne({
      where: { id: instanceId },
      relations: ['goal', 'user'],
    });

    if (!instance) throw new NotFoundException();
    if (instance.user.id !== userId) throw new ForbiddenException();

    if (instance.goal.metricType === 'binary') {
      throw new BadRequestException('Binary goal cannot be incremented');
    }

    instance.completedValue += value;

    if (
      instance.targetValue !== null &&
      instance.completedValue >= instance.targetValue
    ) {
      instance.completedValue = instance.targetValue;
      instance.isCompleted = true;
    }

    return this.instanceRepo.save(instance);
  }

  async decrement(instanceId: number, userId: number, value = 1) {
    const instance = await this.instanceRepo.findOne({
      where: { id: instanceId },
      relations: ['goal', 'user'],
    });

    if (!instance) throw new NotFoundException();
    if (instance.user.id !== userId) throw new ForbiddenException();

    instance.completedValue = Math.max(
      0,
      instance.completedValue - value,
    );

    if (
      instance.targetValue !== null &&
      instance.completedValue < instance.targetValue
    ) {
      instance.isCompleted = false;
    }

    return this.instanceRepo.save(instance);
  }

}
