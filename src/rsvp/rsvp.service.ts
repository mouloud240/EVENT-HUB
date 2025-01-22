import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import { prismaService } from 'src/db/prisma.service';
import { rsvp, rsvpStatus } from '@prisma/client';
import { PaginationDtoRes } from './dto/pagination.dto';
import { EventRsvpQueryResult } from './interfaces/rsvp';
interface updateAllprops {
  status: rsvpStatus;
}
@Injectable()
export class RsvpService {
  constructor(private readonly db: prismaService) {}
  async findAllUserRsvpsPagination(
    id: string,
    page: number,
    limit: number,
  ): Promise<PaginationDtoRes<rsvp>> {
    if (page <= 0 || limit < 0) {
      throw new HttpException(
        'page and limit must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const rsvpsCount = await this.db.rsvp.count({ where: { UserId: id } });
      const rsvps = await this.db.rsvp.findMany({
        where: {
          UserId: id,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
      const totalElements = rsvps.length;
      const totalPages = Math.ceil(rsvpsCount / limit);
      return {
        content: rsvps,
        totalElements: totalElements,
        totalPages: totalPages,
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUserRsvp(eventId: string, userId: string): Promise<boolean> {
    //TODO shouldn't be hardcoded but to refactor later
    const pendingRatioOverCapacity = 2;
    const event = await this.db.$queryRaw<EventRsvpQueryResult[]>`

    SELECT 
      e.id AS event_id,
      e.capacity,
      COUNT(CASE WHEN r.status = 'PENDING' THEN 1 END) AS pending_rsvps_count,
      COUNT(CASE WHEN r.status = 'ACCEPTED' THEN 1 END) AS accepted_rsvps_count,
      COUNT(CASE WHEN r."UserId" = ${userId} THEN 1 END) AS user_rsvp_count
    FROM 
      events e
    LEFT JOIN 
      rsvps r ON e.id = r."EventId"
    WHERE 
      e.id = ${eventId}
    GROUP BY 
      e.id, e.capacity;
  `;

    // Handle cases where the event is not found
    if (!event || event.length === 0) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const eventDetails = event[0]; // Query result is typically an array
    const {
      capacity,
      pending_rsvps_count,
      accepted_rsvps_count,
      user_rsvp_count,
    } = eventDetails;

    const totalRsvps = pending_rsvps_count + accepted_rsvps_count;
    const isFullDueToAccepted = accepted_rsvps_count >= capacity;
    //TODO in each of this ifs we should log the error to some loggin service
    if (isFullDueToAccepted) {
      throw new HttpException('Event is full', HttpStatus.BAD_REQUEST);
    }
    const isFullDueToPending =
      pending_rsvps_count >= capacity &&
      totalRsvps >= capacity * pendingRatioOverCapacity;
    if (isFullDueToPending) {
      throw new HttpException('Event is full', HttpStatus.BAD_REQUEST);
    }

    // Check if the user has already RSVPed
    const isRsvped = user_rsvp_count > 0;
    if (isRsvped) {
      throw new HttpException(
        'User has already RSVPed for this event',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If all checks pass, return false (user has not RSVPed and can proceed)
    return false;
  }
  async create(createRsvpDto: CreateRsvpDto, userID: string) {
    try {
      const canRsvp = await this.validateUserRsvp(
        createRsvpDto.EventId,
        userID,
      );
      if (canRsvp) {
        throw new Error('User already RSVPed to this event');
      }
      return this.db.rsvp.create({
        data: { ...createRsvpDto, UserId: userID },
      });
    } catch (error) {
      throw new HttpException(
        'an errror occured while trying to create RSVP: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAllUserRsvps(userID: string) {
    try {
      return this.db.rsvp.findMany({ where: { UserId: userID } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
  findAllEVentRsvps(eventID: string) {
    try {
      return this.db.rsvp.findMany({ where: { EventId: eventID } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
  findAll() {
    try {
      return this.db.rsvp.findMany();
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  findOne(id: string) {
    try {
      return this.db.rsvp.findUniqueOrThrow({ where: { id: id } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
  async update(UpdateRsvpDto: UpdateRsvpDto, uid: string) {
    if (UpdateRsvpDto.status == rsvpStatus.ACCEPTED) {
      const queryRes = await this.db.event.findUnique({
        where: { id: UpdateRsvpDto.EventId },
        select: {
          capacity: true,
          _count: {
            select: { rsvps: { where: { status: rsvpStatus.ACCEPTED } } },
          },
        },
      });
      const isFullDueToAccepted = queryRes._count.rsvps == queryRes.capacity;
      if (isFullDueToAccepted) {
        await this.db.rsvp.deleteMany({
          where: {
            EventId: UpdateRsvpDto.EventId,
            status: { in: [rsvpStatus.PENDING, rsvpStatus.REJECTED] },
          },
        });
        throw new HttpException(
          'Event is full ' + UpdateRsvpDto.EventId,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const updatedCount = await this.db.rsvp.updateMany({
        where: {
          EventId: UpdateRsvpDto.EventId,
          UserId: uid,
        },
        data: { status: UpdateRsvpDto.status },
      });
      if (updatedCount.count == 0) {
        throw new HttpException('RSVP not Found', HttpStatus.NOT_FOUND);
      }
      return { message: 'user Rsvps where Updated Succesfully' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const deletedCount = await this.db.rsvp.delete({ where: { id: id } });
      if (deletedCount) {
        return { message: 'Rsvp deleted succesfully' };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async removeAlleventRsvp(eventId: string) {
    try {
      const deletedCount = await this.db.rsvp.deleteMany({
        where: { EventId: eventId },
      });
      if (deletedCount.count == 0) {
        throw new HttpException(
          'No Rsvps for this event',
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Deleted Succesfully' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async findAllEventsRvpsPagination(
    id: string,
    page: number,
    limit: number,
  ): Promise<PaginationDtoRes<rsvp>> {
    if (page <= 0 || limit <= 0) {
      throw new HttpException(
        'page and limit must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const totalrsvpsCount = await this.db.rsvp.count({
        where: { EventId: id },
      });
      const res = await this.db.rsvp.findMany({
        where: {
          EventId: id,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      const totalElements = res.length;
      const totalPages = Math.ceil(totalrsvpsCount / limit);
      const returnObj: PaginationDtoRes<rsvp> = {
        totalPages: totalPages,
        totalElements: totalElements,
        content: res,
        page: page,
        limit: limit,
      };
      return returnObj;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  async updateAllUsersRsvp({ status }: updateAllprops, id: string) {
    try {
      const updatedCount = await this.db.rsvp.updateMany({
        where: {
          UserId: id,
        },
        data: {
          status: status,
        },
      });
      if (updatedCount.count == 0) {
        throw new HttpException(
          "User doesn't have any rspvs",
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'User Rsvps where Updated Succesfully' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async removeEventRsvp(id: string): Promise<{ message: string }> {
    try {
      const deletedReport = await this.db.rsvp.deleteMany({
        where: {
          EventId: id,
        },
      });
      if (deletedReport.count == 0) {
        throw new HttpException(
          'No Rsvps for this event',
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Event Rsvps where deleted Succesfully' };
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
