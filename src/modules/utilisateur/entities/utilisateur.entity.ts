import { Entity, Column, TableInheritance, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/roles.enum';

@Entity('utilisateur')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Utilisateur extends BaseEntity {
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  motDePasse: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  estVerifie: boolean;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  @Exclude()
  verificationToken: string;

  @Column({ nullable: true })
  verificationExpires: Date;

  @Column({ default: true })
  isActive: boolean;
}