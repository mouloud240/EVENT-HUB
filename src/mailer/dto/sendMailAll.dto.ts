import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MailAllDto {
  @ApiProperty({description:"The subject of the email"})
  @IsString()
  subject: string;
  @IsString()
  @ApiProperty({description:"The body of the email"})
  body: string;
}
