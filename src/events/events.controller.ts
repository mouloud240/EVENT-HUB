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
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { event, user } from '@prisma/client';
import { PaginationDto, PaginationDtoRes } from 'src/rsvp/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@UseGuards(jwtGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(
    @Body('data')
    rawData: string,

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1000000,
          message: 'file size should be less than 1mb',
        })
        .build(),
    )
    coverImage: Express.Multer.File,
    @currentUser() user: user,
  ): Promise<event> {
    const createEventDto = plainToInstance(CreateEventDto, JSON.parse(rawData));
    const error = await validate(createEventDto);
    if (error.length > 0) {
      throw new BadRequestException(error);
    }

    return this.eventsService.create(createEventDto, user.id, coverImage);
  }

  @Get()
  findAll(@currentUser() user: user): Promise<Array<event>> {
    return this.eventsService.findAll(user.id);
  }
  @Get('/pages')
  findAllPagination(
    @Query() query: PaginationDto,
  ): Promise<PaginationDtoRes<event>> {
    return this.eventsService.findAllPagination(query);
  }
  @Get('/user')
  findAlluserEvents(@currentUser() user: user): Promise<Array<event>> {
    return this.eventsService.findAlluserEvents(user.id);
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
  remove(
    @Param('id') id: string,
    @currentUser() user: user,
  ): Promise<{ message: string }> {
    return this.eventsService.remove(id, user.id);
  }
  @Delete()
  deleteAll(@currentUser() user: user): Promise<{ message: string }> {
    return this.eventsService.removeAllUserEvents(user.id);
  }
}
