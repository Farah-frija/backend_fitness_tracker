import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { BodyMetricsService } from '../services/body-metrics.service';
import { CreateBodyMetricsDto } from '../dtos/create-body-metrics.dto';
import { Request } from 'express';
import { UtilisateurService } from '../../utilisateur/services/utilisateur.service';

@Controller('users')
export class BodyMetricsController {
  constructor(
    private readonly service: BodyMetricsService,
    private readonly userService: UtilisateurService,
  ) {}

  // ------------------------------
  // Body metrics endpoints
  // ------------------------------
  @Post(':userId/metrics')
  create(
    @Param('userId') userId: number,
    @Body() dto: CreateBodyMetricsDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Get(':userId/metrics')
  findAll(@Param('userId') userId: number) {
    return this.service.findAllForUser(userId);
  }

  // ------------------------------
  // User endpoints
  // ------------------------------
  @Get(':userId')
  getUserById(@Param('userId') userId: number) {
    return this.userService.findById(userId);
  }

  @Get('me')
  getCurrentUser(@Req() req: Request) {
    // If you have authentication, extract userId from JWT/session
    const mockUserId = 2; // replace with req.user.id in a real auth setup
    return this.userService.findById(mockUserId);
  }
}
