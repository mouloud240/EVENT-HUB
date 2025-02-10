import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRsvpDto {
  @ApiProperty({
    name: 'EventId',
    description: 'The event Id to add the RSVP to',
  })
  @IsString({ message: 'Please enter The event Id as a string' })
  EventId: string;
}
