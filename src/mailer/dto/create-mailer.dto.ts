import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateIf } from 'class-validator';
export class SpecificMailDto {
  @ApiProperty({ description: 'the Email of the user' })
  @IsEmail()
  to: string;
  @ApiProperty({ description: 'the subject of the email' })
  @IsString()
  subject: string;
  @ApiProperty({ description: 'the body of the email' })
  @IsString()
  body: string;
  @ApiProperty({ description: 'the call to action of the email' })
  @IsString()
  @ValidateIf((o) => o.callToAction != undefined)
  callToAction?: string;
  @ApiProperty({ description: 'the link of the call to action' })
  @IsString()
  @ValidateIf((o) => o.callToAction != undefined)
  ctaLink?: string;
}
//refatoring the class to look like the type
export type SpecificMailDtoType = {
  to: string;
  subject: string;
  body: string;
} & (
  | {
      callToaction: string;
      ctaLink: string;
    }
  | object
);
