import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
@Injectable()
export class googleStrategy extends PassportStrategy(Strategy){
    constructor(
   configService:ConfigService, 
  ){
    super({
      clientID:configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret:configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL:'http://localhost:3000/auth/google/redirect',
      scope:['email','profile'],
    })
  }

  validate(accesToken:string,refreshToken:string,profile:Profile): unknown {
    console.log(profile)
    return profile
  }

  }

