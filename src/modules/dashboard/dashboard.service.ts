import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DashboardStatsDto,
  WorkoutDataDto,
  ActivityBreakdownDto,
  WeeklySummaryDto,
  MonthlySummaryDto,
} from './dto';
import { Workout } from './entities/workout.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
  ) {}

  /**
   * Get overall dashboard statistics
   */
  async getStats(userId: number): Promise<DashboardStatsDto> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Overall stats
    const overallStats = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('COUNT(*)', 'totalWorkouts')
      .addSelect('COALESCE(SUM(workout.calories), 0)', 'totalCalories')
      .addSelect('COALESCE(SUM(workout.distance), 0)', 'totalDistance')
      .addSelect('COALESCE(SUM(workout.duration), 0)', 'totalDuration')
      .where('workout.user_id = :userId', { userId })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .getRawOne();

    // Weekly stats
    const weeklyStats = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('COUNT(*)', 'count')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :weekAgo', { weekAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .getRawOne();

    // Monthly stats
    const monthlyStats = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('COUNT(*)', 'count')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :monthAgo', { monthAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .getRawOne();

    // Calculate goal progress (assuming weekly goal is 5 workouts, monthly is 20)
    const weeklyGoal = 5;
    const monthlyGoal = 20;
    const weeklyGoalProgress = Math.min(
      Math.round((weeklyStats.count / weeklyGoal) * 100),
      100,
    );
    const monthlyGoalProgress = Math.min(
      Math.round((monthlyStats.count / monthlyGoal) * 100),
      100,
    );

    return {
      totalWorkouts: parseInt(overallStats.totalWorkouts) || 0,
      totalCalories: parseFloat(overallStats.totalCalories) || 0,
      totalDistance: parseFloat(overallStats.totalDistance) || 0,
      totalDuration: parseFloat(overallStats.totalDuration) || 0,
      weeklyGoalProgress,
      monthlyGoalProgress,
    };
  }

  /**
   * Get weekly workout data (last 7 days)
   */
  async getWeeklyData(userId: number): Promise<WorkoutDataDto[]> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const data = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('DATE(workout.workout_date)', 'date')
      .addSelect('COUNT(*)', 'workouts')
      .addSelect('COALESCE(SUM(workout.calories), 0)', 'calories')
      .addSelect('COALESCE(SUM(workout.duration), 0)', 'duration')
      .addSelect('COALESCE(SUM(workout.distance), 0)', 'distance')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :weekAgo', { weekAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .groupBy('DATE(workout.workout_date)')
      .orderBy('DATE(workout.workout_date)', 'ASC')
      .getRawMany();

    return data.map((item) => ({
      date: this.formatDate(item.date),
      workouts: parseInt(item.workouts) || 0,
      calories: parseFloat(item.calories) || 0,
      duration: parseFloat(item.duration) || 0,
      distance: parseFloat(item.distance) || 0,
    }));
  }

  /**
   * Get monthly workout data (aggregated by week)
   */
  async getMonthlyData(userId: number): Promise<WorkoutDataDto[]> {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const data = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select(
        "DATE_TRUNC('week', workout.workout_date)",
        'weekStart',
      )
      .addSelect('COUNT(*)', 'workouts')
      .addSelect('COALESCE(SUM(workout.calories), 0)', 'calories')
      .addSelect('COALESCE(SUM(workout.duration), 0)', 'duration')
      .addSelect('COALESCE(SUM(workout.distance), 0)', 'distance')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :monthAgo', { monthAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .groupBy(
        "DATE_TRUNC('week', workout.workout_date)",
      )
      .orderBy("DATE_TRUNC('week', workout.workout_date)", 'ASC')
      .getRawMany();

    return data.map((item) => ({
      date: this.formatDate(item.weekStart),
      workouts: parseInt(item.workouts) || 0,
      calories: parseFloat(item.calories) || 0,
      duration: parseFloat(item.duration) || 0,
      distance: parseFloat(item.distance) || 0,
    }));
  }

  /**
   * Get activity type breakdown with percentages
   */
  async getActivityBreakdown(userId: number): Promise<ActivityBreakdownDto[]> {
    const totalCount = await this.workoutRepository.count({
      where: { user_id: userId },
    });

    if (totalCount === 0) {
      return [];
    }

    const data = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('workout.activity_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('workout.user_id = :userId', { userId })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .groupBy('workout.activity_type')
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany();

    // Color palette for activities
    const colors = [
      '#4CAF50', // Green
      '#2196F3', // Blue
      '#FF9800', // Orange
      '#9C27B0', // Purple
      '#F44336', // Red
      '#00BCD4', // Cyan
      '#FFEB3B', // Yellow
      '#795548', // Brown
    ];

    return data.map((item, index) => ({
      type: item.type,
      count: parseInt(item.count) || 0,
      percentage: Math.round((parseInt(item.count) / totalCount) * 100),
      color: colors[index % colors.length],
    }));
  }

  /**
   * Get weekly summary with most active day
   */
  async getWeeklySummary(userId: number): Promise<WeeklySummaryDto> {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Weekly totals
    const totals = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('COUNT(*)', 'totalWorkouts')
      .addSelect('COALESCE(SUM(workout.calories), 0)', 'totalCalories')
      .addSelect('COALESCE(SUM(workout.distance), 0)', 'totalDistance')
      .addSelect('COALESCE(SUM(workout.duration), 0)', 'totalDuration')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :weekAgo', { weekAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .getRawOne();

    // Most active day
    const mostActive = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('DATE(workout.workout_date)', 'date')
      .addSelect('COUNT(*)', 'workoutCount')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :weekAgo', { weekAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .groupBy('DATE(workout.workout_date)')
      .orderBy('COUNT(*)', 'DESC')
      .limit(1)
      .getRawOne();

    const totalWorkouts = parseInt(totals.totalWorkouts) || 0;
    const averageCaloriesPerDay =
      totalWorkouts > 0 ? Math.round(parseFloat(totals.totalCalories) / 7) : 0;

    const totalDuration = parseFloat(totals.totalDuration) || 0;
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    return {
      totalWorkouts,
      totalCalories: parseFloat(totals.totalCalories) || 0,
      totalDistance: parseFloat(totals.totalDistance) || 0,
      avgDuration, // Average duration per workout
      mostActiveDay: mostActive ? this.formatDate(mostActive.date) : '',
      averageCaloriesPerDay,
    };
  }

  /**
   * Get monthly summary with top activity
   */
  async getMonthlySummary(userId: number): Promise<MonthlySummaryDto> {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Monthly totals
    const totals = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('COUNT(*)', 'totalWorkouts')
      .addSelect('COALESCE(SUM(workout.calories), 0)', 'totalCalories')
      .addSelect('COALESCE(SUM(workout.distance), 0)', 'totalDistance')
      .addSelect('COALESCE(SUM(workout.duration), 0)', 'totalDuration')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :monthAgo', { monthAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .getRawOne();

    // Top activity
    const topActivity = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('goals', 'goal', 'workout.goal_id = goal.id')
      .select('workout.activity_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('workout.user_id = :userId', { userId })
      .andWhere('workout.workout_date >= :monthAgo', { monthAgo })
      .andWhere('(workout.goal_id IS NULL OR goal.is_active = true)')
      .groupBy('workout.activity_type')
      .orderBy('COUNT(*)', 'DESC')
      .limit(1)
      .getRawOne();

    const totalWorkouts = parseInt(totals.totalWorkouts) || 0;
    const averageWorkoutsPerWeek = Math.round(totalWorkouts / 4.3); // ~4.3 weeks in a month
    const averageCaloriesPerDay = Math.round(
      parseFloat(totals.totalCalories) / 30,
    );

    return {
      totalWorkouts,
      totalCalories: parseFloat(totals.totalCalories) || 0,
      totalDistance: parseFloat(totals.totalDistance) || 0,
      totalDuration: parseFloat(totals.totalDuration) || 0,
      topActivity: topActivity
        ? {
            type: topActivity.type,
            count: parseInt(topActivity.count) || 0,
          }
        : { type: '', count: 0 },
      averageWorkoutsPerWeek,
      averageCaloriesPerDay,
    };
  }

  /**
   * Helper method to format dates to YYYY-MM-DD
   */
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
