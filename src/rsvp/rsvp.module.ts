import { Module } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { RsvpController } from './rsvp.controller';

@Module({
  controllers: [RsvpController],
  providers: [RsvpService],
})
export class RsvpModule {}
