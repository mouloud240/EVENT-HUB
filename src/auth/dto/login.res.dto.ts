import { user } from "@prisma/client";
import { IsString } from "class-validator";

export class LoginResDto {
  @IsString()
  AccessToken: string;
  @IsString()
  RefreshToken: string; 
  user:Omit<user,'password'>
 }
