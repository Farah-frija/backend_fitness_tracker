export class WeeklySummaryDto {
  totalWorkouts: number;
  totalCalories: number;
  totalDistance: number;
  avgDuration: number; // Average duration per workout in minutes
  mostActiveDay: string; // Formatted date string
  averageCaloriesPerDay: number;
}
