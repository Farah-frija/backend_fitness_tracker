import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  DashboardStatsDto,
  WorkoutDataDto,
  ActivityBreakdownDto,
  WeeklySummaryDto,
  MonthlySummaryDto,
} from './dto';

@Controller('api/dashboard')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for frontend testing
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /api/dashboard/stats
   * Get overall dashboard statistics
   */
  @Get('stats')
  async getStats(@Request() req): Promise<DashboardStatsDto> {
    try {
      const userId = 1; // Hardcoded for testing - change to 2 for User 2
      return await this.dashboardService.getStats(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch dashboard statistics',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/dashboard/weekly
   * Get weekly workout data (last 7 days)
   */
  @Get('weekly')
  async getWeeklyData(@Request() req): Promise<WorkoutDataDto[]> {
    try {
      const userId = 1; // Hardcoded for testing - change to 2 for User 2
      return await this.dashboardService.getWeeklyData(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch weekly data',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/dashboard/monthly
   * Get monthly workout data (aggregated by week)
   */
  @Get('monthly')
  async getMonthlyData(@Request() req): Promise<WorkoutDataDto[]> {
    try {
      const userId = 1; // Hardcoded for testing - change to 2 for User 2
      return await this.dashboardService.getMonthlyData(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch monthly data',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/dashboard/activity-breakdown
   * Get activity type distribution with percentages
   */
  @Get('activity-breakdown')
  async getActivityBreakdown(
    @Request() req,
  ): Promise<ActivityBreakdownDto[]> {
    try {
      const userId = 1; // Hardcoded for testing - change to 2 for User 2
      return await this.dashboardService.getActivityBreakdown(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch activity breakdown',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/dashboard/summary/weekly
   * Get weekly summary with most active day
   */
  @Get('summary/weekly')
  async getWeeklySummary(@Request() req): Promise<WeeklySummaryDto> {
    try {
      const userId = 1; // Hardcoded for testing - change to 2 for User 2
      return await this.dashboardService.getWeeklySummary(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch weekly summary',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/dashboard/summary/monthly
   * Get monthly summary with top activity
   */
  @Get('summary/monthly')
  async getMonthlySummary(@Request() req): Promise<MonthlySummaryDto> {
    try {
      const userId = 1; // Hardcoded for testing - change to 2 for User 2
      return await this.dashboardService.getMonthlySummary(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch monthly summary',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
