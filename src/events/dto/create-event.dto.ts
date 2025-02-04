import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
export class CreateEventDto {
  @ApiProperty({ description: 'name of the event' })
  @IsString({ message: 'name must be a string' })
  name: string;
  @ApiProperty({ description: 'description of the event' })
  @IsString({ message: 'description must be a string' })
  description: string;
  @ApiProperty({ description: 'city of the event' })
  @IsString()
  city: string;
  @ApiProperty({ description: 'latitude of the location of the event' })
  @IsLatitude()
  lat: number;
  @ApiProperty({ description: 'longitude of the location of the event' })
  @IsLongitude()
  long: number;
  @Type(() => Date)
  @IsDate()
  date: Date;
  @ApiProperty({ description: 'capacity of the event' })
  @IsInt()
  @Min(1)
  capacity: number;
}
export class CreateEventDtoParsed{
  @Transform(({ value }) => JSON.parse(value))
  data: CreateEventDto;
}
