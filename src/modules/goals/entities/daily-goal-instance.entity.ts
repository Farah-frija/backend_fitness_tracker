import {
  Entity,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Goal } from './goal.entity';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('daily_goal_instances')
@Unique(['goal', 'date'])
export class DailyGoalInstance extends BaseEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float', nullable: true })
  targetValue?: number;

  @Column({ type: 'float', default: 0 })
  completedValue: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: true })
  isGoalActive: boolean;

  @ManyToOne(() => Goal, { onDelete: 'CASCADE' })
  goal: Goal;

  @ManyToOne(() => Utilisateur, { onDelete: 'CASCADE' })
  user: Utilisateur;
}
