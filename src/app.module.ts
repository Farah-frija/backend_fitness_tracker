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
   GoalsModule,
    ForumModule,
        ScheduleModule.forRoot(),

    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
