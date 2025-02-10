import { ApiProperty } from '@nestjs/swagger';
import { rsvpStatus } from '@prisma/client';

export class RsvpEntity {
  @ApiProperty({ name: 'id', description: 'The id of the RSVP' })
  id: string;
  @ApiProperty({ name: 'userId', description: 'The user Id of the RSVP' })
  userId: string;
  @ApiProperty({ name: 'eventId', description: 'The event Id of the RSVP' })
  eventId: string;
  @ApiProperty({ name: 'status', description: 'The status of the Rsvp' })
  status: rsvpStatus;
  @ApiProperty({
    name: 'createdAt',
    description: 'The date the Rsvp was created',
  })
  createdAt: Date;
  @ApiProperty({
    name: 'updatedAt',
    description: 'The date the Rsvp was updated',
  })
  updatedAt: Date;
}
