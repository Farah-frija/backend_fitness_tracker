import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @Column({ name: 'activity_type', length: 50 })
  activity_type: string;

  @Column({ name: 'workout_date', type: 'timestamp' })
  workout_date: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // in minutes

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  calories: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  distance: number; // in km

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
