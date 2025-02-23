import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class testGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().headers['authorization'];
    if (!jwt) return false;
    const token = jwt.split(' ')[1];
    try {
      console.log(token);
      const tt = this.jwtService.verify(token, {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
