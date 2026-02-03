import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppDataSource,
  databaseConfig,

} from './config/configuration';
import { ForumModule } from './modules/forum/forum.module';
import { BodyMetricsModule } from './modules/metrics/body-metrics.module';
import { GoalsModule } from './modules/goals/goals.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options,
      }),
    }),
    UtilisateurModule,
    BodyMetricsModule,
   
   GoalsModule,
    ForumModule,
        ScheduleModule.forRoot(),

    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
