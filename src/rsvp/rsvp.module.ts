import { Module } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { RsvpController } from './rsvp.controller';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [RsvpController],
  providers: [RsvpService],
})
export class RsvpModule {}
