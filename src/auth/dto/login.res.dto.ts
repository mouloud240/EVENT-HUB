import { user } from "@prisma/client";

export interface LoginResDto {
  AccessToken: string;
  RefreshToken: string;
  user:user
 }
