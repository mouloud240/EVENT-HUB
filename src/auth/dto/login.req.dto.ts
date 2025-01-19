import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,  IsStrongPassword,  } from "class-validator";

export class loginReqDto {
  @ApiProperty({name:'email',description:'email of the user'})
  @IsEmail({},{message:'email is invalid'})
 email: string;
  @ApiProperty({name:'password',description:'password of the user'})
  @IsStrongPassword()
  password: string;
}
