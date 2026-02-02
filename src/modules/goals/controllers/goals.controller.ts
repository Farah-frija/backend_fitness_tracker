import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { GoalsService } from '../services/goal.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { GoalTrackerService } from '../services/goal-tracker-service';

import {
  ApiTags,
  ApiHeader,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TrackGoalDto } from '../entities/track-goal.dto';

@ApiTags('goals')
@ApiHeader({ name: 'x-user-id', description: 'Dev-only header: current user id', required: false })
@Controller('goals')
export class GoalsController {
constructor(
  private readonly goalsService: GoalsService,
  private readonly tracker: GoalTrackerService,
) {}
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateGoalDto })
  @ApiCreatedResponse({ description: 'Goal created' })
  @ApiBadRequestResponse({ description: 'Invalid payload or missing current user' })
  create(
    @CurrentUser() user: Partial<Utilisateur>,
    @Body() dto: CreateGoalDto,
  ) {
    if (!user || !user.id)
      throw new BadRequestException(
        'Current user not provided. For development include x-user-id header',
      );
    // Cast to Utilisateur for service signature
    return this.goalsService.create(user as Utilisateur, dto);
  }

  @Get()
  @ApiOkResponse({ description: 'User goals retrieved' })
  findMyGoals(@CurrentUser() user: Partial<Utilisateur>) {
    if (!user || !user.id)
      throw new BadRequestException(
        'Current user not provided. For development include x-user-id header',
      );
    return this.goalsService.findUserGoals(user.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: UpdateGoalDto })
  @ApiOkResponse({ description: 'Goal updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<Utilisateur>,
    @Body() dto: UpdateGoalDto,
  ) {
    if (!user || !user.id)
      throw new BadRequestException(
        'Current user not provided. For development include x-user-id header',
      );
    return this.goalsService.update(id, user.id, dto);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ description: 'Goal toggled' })
  toggle(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<Utilisateur>,
  ) {
    if (!user || !user.id)
      throw new BadRequestException(
        'Current user not provided. For development include x-user-id header',
      );
    return this.goalsService.toggleActive(id, user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Goal removed' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<Utilisateur>,
  ) {
    if (!user || !user.id)
      throw new BadRequestException(
        'Current user not provided. For development include x-user-id header',
      );
    return this.goalsService.remove(id, user.id);
  }

  // ------------------------
  // ✅ TRACKING
  // ------------------------

  @Patch('instances/:id/toggle')
  toggleBinary(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<Utilisateur>,
  ) {
    if (!user?.id)
      throw new BadRequestException('Current user not provided');
    return this.tracker.toggleBinary(id, user.id);
  }

  @Patch('instances/:id/increment')
  increment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<Utilisateur>,
    @Body() dto: TrackGoalDto,
  ) {
    if (!user?.id)
      throw new BadRequestException('Current user not provided');
    return this.tracker.increment(id, user.id, dto.value);
  }

  @Patch('instances/:id/decrement')
  decrement(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<Utilisateur>,
    @Body() dto: TrackGoalDto,
  ) {
    if (!user?.id)
      throw new BadRequestException('Current user not provided');
    return this.tracker.decrement(id, user.id, dto.value);
  }


    @Get('daily-goals/today')
  getToday(@CurrentUser() user: Partial<Utilisateur>) {
    if (!user?.id)
      throw new BadRequestException('Current user not provided');
    return this.tracker.getToday(user.id);
  }
  
}
