import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { prismaService } from 'src/db/prisma.service';
import { event } from '@prisma/client';
import { PaginationDto, PaginationDtoRes } from 'src/rsvp/dto/pagination.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly db: prismaService,
    private readonly fileUpload: FileUploadService,
  ) {}
  async create(
    createEventDto: CreateEventDto,
    uid: string,
    coverImage: Express.Multer.File,
  ): Promise<event> {
    try {
      const coverPic = await this.fileUpload.handlleFileUpload(coverImage, uid);

      return this.db.event.create({
        data: { ...createEventDto, UserId: uid, coverPic: coverPic },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  findAll(uid: string): Promise<Array<event>> {
    try {
      return this.db.event.findMany({
        include: { createdBy: true },
        where: {
          UserId: { not: uid },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAllPagination(
    paginationDto: PaginationDto,
  ): Promise<PaginationDtoRes<event>> {
    try {
      const allEventCount = await this.db.event.count();
      const events = await this.db.event.findMany({
        include: { createdBy: true },
        take: paginationDto.limit,
        skip: (paginationDto.page - 1) * paginationDto.limit,
      });
      const returnObj: PaginationDtoRes<event> = {
        content: events,
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalPages: Math.ceil(allEventCount / paginationDto.limit),
        totalElements: events.length,
      };
      return returnObj;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findAlluserEvents(uid: string): Promise<Array<event>> {
    try {
      console.log('Called');
      return this.db.event.findMany({
        where: { UserId: uid },
        include: { createdBy: true },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.I_AM_A_TEAPOT);
    }
  }
  async findAllUserEventsPagination(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginationDtoRes<event>> {
    try {
      const allEventCount = await this.db.event.count({
        where: { UserId: userId },
      });
      const events = await this.db.event.findMany({
        where: { UserId: userId },
        include: { createdBy: true },
        take: paginationDto.limit,
        skip: (paginationDto.page - 1) * paginationDto.limit,
      });
      const returnObj: PaginationDtoRes<event> = {
        content: events,
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalPages: Math.ceil(allEventCount / paginationDto.limit),
        totalElements: events.length,
      };
      return returnObj;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      console.log("I'm called", id);
      const event = await this.db.event.findUnique({
        where: {
          id: id,
        },
        include: { createdBy: true },
      });
      if (!event) {
        throw new HttpException('Event not founded', HttpStatus.NOT_FOUND);
      }
      return event;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: string, updateEventDto: UpdateEventDto): Promise<event> {
    try {
      return this.db.event.update({
        where: { id: id },
        data: updateEventDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    try {
      const IsUserEvent = await this.db.event.count({
        where: { id: id, UserId: userId },
      });
      if (IsUserEvent === 0) {
        throw new HttpException(
          'You are not authorized to delete this event',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const deleteResult = await this.db.event.delete({
        where: { id: id },
      });

      if (!deleteResult) {
        throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Event deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async removeAllUserEvents(uid: string): Promise<{ message: string }> {
    try {
      const deleteResult = await this.db.event.deleteMany({
        where: { UserId: uid },
      });
      if (!deleteResult) {
        throw new HttpException(
          'No events found for this user',
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'All events deleted' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
