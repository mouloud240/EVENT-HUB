import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { IMailerModule } from 'src/mailer/mailer.module';

@Module({
  providers: [],
  controllers: [],
  imports: [PrismaModule, IMailerModule],
})
export class SchedulerModule {}
