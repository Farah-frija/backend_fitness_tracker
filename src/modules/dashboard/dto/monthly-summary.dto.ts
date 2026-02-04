export class MonthlySummaryDto {
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  totalDuration: number;
  topActivity: {
    type: string;
    count: number;
  };
  averageWorkoutsPerWeek: number;
  averageCaloriesPerDay: number;
}
