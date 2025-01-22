import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/db/prisma.module';
import { IMailerModule } from 'src/mailer/mailer.module';

@Module({
  providers: [],
  controllers: [],
  imports: [PrismaModule, IMailerModule, ScheduleModule.forRoot()],
})
export class SchedulerModule {}
