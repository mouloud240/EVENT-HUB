import { IsEnum } from 'class-validator';
import { CreateRsvpDto} from './create-rsvp.dto';
import { rsvpStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRsvpDto extends CreateRsvpDto  {
  @ApiProperty({name:"status",description:"The status of the RSVP"})
  @IsEnum(rsvpStatus,{message:"INVALID status "})
  status:rsvpStatus
}
