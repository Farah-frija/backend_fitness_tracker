import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ChildEntity,
  OneToMany,
} from 'typeorm';
import { Utilisateur } from './utilisateur.entity';

import { UserRole } from '../../../common/enums/roles.enum';

@ChildEntity('veterinarian')
export class Veterinaire extends Utilisateur {
  constructor() {
    super();
    this.role = UserRole.VETERINARIAN;
  }

  @Column({ unique: true, nullable: true })
  numLicence: string;

  @Column({ nullable: true })
  specialites: string;



 
}
