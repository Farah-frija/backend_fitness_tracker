import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('body_metrics')
export class BodyMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Utilisateur, (user) => user.metrics, {eager: true,
    onDelete: 'CASCADE',
  })
  user: Utilisateur;

  @Column('float')
  heightCm: number;

  @Column('float')
  weightKg: number;

  @Column('float')
  bmi: number;

  @Column('float', { nullable: true })
  bodyFat?: number;

  @Column('float', { nullable: true })
  waistCm?: number;

  @Column('float', { nullable: true })
  neckCm?: number;

  @Column('float', { nullable: true })
  hipCm?: number;

  @Column('int', { nullable: true })
  systolic?: number;

  @Column('int', { nullable: true })
  diastolic?: number;

  @Column('int', { nullable: true })
  pulseRate?: number;

  @CreateDateColumn()
  recordedAt: Date;
}
