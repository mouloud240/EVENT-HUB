import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { UsersModule } from './users/users.module';
import { IMailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './db/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';
import { LoggerMiddleware } from './auth/middlwares/logger.middleware';
import { SchedulerService } from './scheduler/scheduler.service';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [PassportModule,EventsModule, RsvpModule, UsersModule, IMailerModule, AuthModule,ConfigModule.forRoot(
    {
      isGlobal:true,
    },
  ),
    PrismaModule,

 ScheduleModule.forRoot(),

 SchedulerModule, 
  ],
  controllers: [AppController],
  providers: [AppService, SchedulerService],
})
export class AppModule implements NestModule  {
    configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
