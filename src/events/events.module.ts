import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
