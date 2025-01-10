import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
export class SpecificMailDto {
  @ApiProperty({description: "the Email of the user" })
  @IsEmail()
  to: string;
  @ApiProperty({description: "the subject of the email" })
  @IsString()
  subject: string;
  @ApiProperty({description: "the body of the email" })
  @IsString()
  body: string; 
}
