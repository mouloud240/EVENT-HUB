import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { jwtPayload } from '../interfaces/jwtPayload';
import { Injectable } from '@nestjs/common';
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: jwtPayload) {
    return this.userService.findOne(payload.id);
  }
}
