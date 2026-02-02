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
    // Defensive: goal.schedule may be null if the relation wasn't loaded.
    const schedule = goal.schedule;

    // If no schedule, treat as one-off only on goal.startDate (if present)
    if (!schedule) {
      if (goal.startDate) {
        const start = new Date(goal.startDate);
        start.setHours(0, 0, 0, 0);
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return start.getTime() === d.getTime();
      }
      return false;
    }

    if (schedule.frequencyType === 'daily') return true;

    if (schedule.frequencyType === 'weekly') {
      return schedule.daysOfWeek?.includes(date.getDay());
    }

    return false;
  }
}
