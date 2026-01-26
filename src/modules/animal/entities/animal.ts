import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ProprietaireAnimal } from '../../utilisateur/entities/proprietaire-animal';

import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class Animal extends BaseEntity{

  @Column()
  nom: string;

  @Column()
  espece: string;

  @Column()
  race: string;

  @Column({ type: 'date' })
  dateNaissance: Date;

  @Column()
  sexe: string;






}
