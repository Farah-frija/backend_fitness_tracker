export class WeeklySummaryDto {
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  totalDuration: number;
  mostActiveDay: {
    date: string;
    workouts: number;
  };
  averageCaloriesPerDay: number;
}
