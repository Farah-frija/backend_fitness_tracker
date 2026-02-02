import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { GoalInstanceGeneratorService } from './goal-instance-generator.service';
import {  MoreThanOrEqual } from 'typeorm';
import { DailyGoalInstance } from '../entities/daily-goal-instance.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(DailyGoalInstance)
    private readonly instanceRepo: Repository<DailyGoalInstance>,

    private readonly instanceGenerator: GoalInstanceGeneratorService,
  ) {}
  

async create(user: Utilisateur, dto: CreateGoalDto) {
  const goal = this.goalRepository.create({
    title: dto.title,
    description: dto.description,
    goalType: dto.goalType,
    metricType: dto.metricType,
    targetValue: dto.targetValue,
    unit: dto.unit,
    user,
    isActive: true,
    schedule: {
      frequencyType: dto.frequencyType,
      daysOfWeek: dto.daysOfWeek,
    },
  });

  const savedGoal = await this.goalRepository.save(goal);

  await this.instanceGenerator.generateForGoal(savedGoal);

  return savedGoal;
  }

  async findUserGoals(userId: number): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    goalId: number,
    userId: number,
    dto: UpdateGoalDto,
  ): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId },
      relations: ['user', 'schedule'],
    });

    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.user.id !== userId) throw new ForbiddenException();

    Object.assign(goal, dto);
    return this.goalRepository.save(goal);
  }

  async remove(goalId: number, userId: number): Promise<void> {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId },
      relations: ['user', 'schedule'],
    });

    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.user.id !== userId) throw new ForbiddenException();

    await this.goalRepository.remove(goal);
  }

async toggleActive(goalId: number, userId: number): Promise<Goal> {
  const goal = await this.goalRepository.findOne({
    where: { id: goalId },
      relations: ['user', 'schedule'],
  });

  if (!goal) throw new NotFoundException('Goal not found');
  if (goal.user.id !== userId) throw new ForbiddenException();

  // Toggle state
  goal.isActive = !goal.isActive;
  const savedGoal = await this.goalRepository.save(goal);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 🔑 Update today + future instances
  await this.instanceRepo.update(
    {
      goal: { id: goal.id },
      date: MoreThanOrEqual(today),
    },
    {
      isGoalActive: savedGoal.isActive,
    },
  );

  // Optional but VERY nice UX:
  // If goal is re-activated, ensure instances exist
  if (savedGoal.isActive) {
    await this.instanceGenerator.generateForGoal(savedGoal);
  }

  return savedGoal;
}


  
}
