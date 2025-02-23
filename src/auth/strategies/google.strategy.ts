import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
@Injectable()
export class googleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
      passReqToCallback: false,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accesToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<any> {
    done(null, profile);
  }
}
