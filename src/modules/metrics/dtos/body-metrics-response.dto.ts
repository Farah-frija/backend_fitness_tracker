export class BodyMetricsResponseDto {
  id: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bodyFat?: number;
  waistCm?: number;
  neckCm?: number;
  hipCm?: number;
  systolic?: number;
  diastolic?: number;
  pulseRate?: number;
  recordedAt: Date;
}
