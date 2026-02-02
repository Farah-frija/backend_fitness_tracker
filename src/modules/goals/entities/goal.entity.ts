import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { GoalSchedule } from './goal-schedule.entity';
import { DailyGoalInstance } from './daily-goal-instance.entity';

@Entity('goals')
export class Goal extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  goalType: string; // walking, water, custom

  @Column()
  metricType: string; // duration, count, volume, binary

  @Column({ type: 'float', nullable: true })
  targetValue?: number;

  @Column({ nullable: true })
  unit?: string; // minutes, ml, times

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  // 🔗 Relations
  @ManyToOne(() => Utilisateur, (user) => user.goals, { onDelete: 'CASCADE' })
  user: Utilisateur;

  // Optional schedule relation (one-to-one)
  @OneToOne(() => GoalSchedule, (schedule) => schedule.goal, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  schedule?: GoalSchedule;

@OneToMany(() => DailyGoalInstance, (i) => i.goal)
dailyInstances: DailyGoalInstance[];

}
