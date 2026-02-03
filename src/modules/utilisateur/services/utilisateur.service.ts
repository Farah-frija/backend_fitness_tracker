// src/modules/utilisateur/services/utilisateur.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../entities/utilisateur.entity';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly repo: Repository<Utilisateur>,
  ) {}

  /**
   * Get user by ID
   */
  async findById(id: number): Promise<Utilisateur> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['metrics', 'posts', 'comments', 'reactions'], // load relations if needed
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<Utilisateur> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  /**
   * Get current user (mocked or via auth)
   */
  async getCurrentUser(): Promise<Utilisateur> {
    // TODO: Replace mock with actual auth
    const mockUserId = 2;
    return this.findById(mockUserId);
  }

  /**
   * Optional: Update user
   */
  async update(id: number, updateData: Partial<Utilisateur>): Promise<Utilisateur> {
    const user = await this.findById(id);
    Object.assign(user, updateData);
    return this.repo.save(user);
  }
}
