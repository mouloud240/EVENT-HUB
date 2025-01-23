import { Module } from '@nestjs/common';
import { RsvpController } from './rsvp.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { RsvpService } from './rsvp.service';

@Module({
  imports:[PrismaModule],
  controllers: [RsvpController],
  providers: [RsvpService],
})
export class RsvpModule {}
