import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { event, user } from '@prisma/client';
import { PaginationDto, PaginationDtoRes } from 'src/rsvp/dto/pagination.dto';

@UseGuards(jwtGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Body() createEventDto: CreateEventDto,
    @currentUser() user: user,
  ): Promise<event> {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get()
  findAll(): Promise<Array<event>> {
    return this.eventsService.findAll();
  }

  @Get('/pages')
  findAllPagination(
    @Query() query: PaginationDto,
  ): Promise<PaginationDtoRes<event>> {
    return this.eventsService.findAllPagination(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<event> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.eventsService.remove(id);
  }
  @Delete()
  deleteAll(@currentUser() user: user): Promise<{ message: string }> {
    return this.eventsService.removeAllUserEvents(user.id);
  }
}
