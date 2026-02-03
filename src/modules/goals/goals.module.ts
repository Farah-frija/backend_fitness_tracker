import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './services/goal.service';
import { GoalsController } from './controllers/goals.controller';
import { Goal } from './entities/goal.entity';
import { GoalSchedule } from './entities/goal-schedule.entity';
import { DailyGoalInstance } from './entities/daily-goal-instance.entity';
import { GoalTrackerService } from './services/goal-tracker-service';
import { GoalInstanceGeneratorService } from './services/goal-instance-generator.service';
import { GoalCronService } from './services/goal-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Goal,
      GoalSchedule,
      DailyGoalInstance,
    ]),
  ],  controllers: [GoalsController],
  providers: [
    GoalsService,
    GoalTrackerService,
    GoalInstanceGeneratorService,
      GoalCronService,
  ],  exports: [GoalsService],
})
export class GoalsModule {}
