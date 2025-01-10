import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { UsersModule } from './users/users.module';
import { IMailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EventsModule, RsvpModule, UsersModule, IMailerModule, AuthModule,ConfigModule.forRoot(
    {
      isGlobal:true,
    }
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
