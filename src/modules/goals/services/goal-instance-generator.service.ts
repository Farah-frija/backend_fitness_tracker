import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyGoalInstance } from '../entities/daily-goal-instance.entity';
import { Goal } from '../entities/goal.entity';

@Injectable()
export class GoalInstanceGeneratorService {
  constructor(
    @InjectRepository(DailyGoalInstance)
    private instanceRepo: Repository<DailyGoalInstance>,
  ) {}

  async generateForGoal(goal: Goal, daysAhead = 7) {
    const today = new Date();

    for (let i = 0; i <= daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (!this.appliesToDate(goal, date)) continue;

      const exists = await this.instanceRepo.exist({
        where: { goal: { id: goal.id }, date },
      });

      if (!exists) {
        await this.instanceRepo.save({
          goal,
          user: goal.user,
          date,
          targetValue: goal.targetValue,
          completedValue: 0,
          isCompleted: false,
          isGoalActive: goal.isActive,
        });
      }
    }
  }

  private appliesToDate(goal: Goal, date: Date): boolean {
    console.log('Checking applicability for date:', date);
    console.log('Goal schedule:', goal.schedule);
    console.log(goal);
    const schedule = goal.schedule;

    if (schedule.frequencyType === 'daily') return true;

    if (schedule.frequencyType === 'weekly') {
      return schedule.daysOfWeek?.includes(date.getDay());
    }

    return false;
  }
}
