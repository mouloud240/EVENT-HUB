import { Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
@Injectable()
export class jwtGuard extends AuthGuard('jwt') implements IAuthGuard {

}
