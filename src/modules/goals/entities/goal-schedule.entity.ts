import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Goal } from './goal.entity';

@Entity('goal_schedules')
export class GoalSchedule extends BaseEntity {
  @Column()
  frequencyType: string; // daily, weekly, custom





  @Column({ type: 'int', array: true, nullable: true })
  daysOfWeek?: number[]; // 0 = Sunday

  @OneToOne(() => Goal, (goal) => goal.schedule, { onDelete: 'CASCADE' })
  @JoinColumn()
  goal: Goal;
}
