import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { localGuard } from './guards/local.guard';
import { currentUser } from './decorators/getUser.decorator';
import { user } from '@prisma/client';
import { AuthService } from './auth.service';
import { jwtGuard } from './guards/jwt.guard';
import { loginReqDto } from './dto/login.req.dto';
import { googleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}
  @Post('login')
  @UseGuards(localGuard)
  login(@currentUser() user: user, @Body() body: loginReqDto) {
    return this.authServices.login(user);
  }
  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authServices.validateRefreshToken(body.refreshToken);
  }

  @Get('protected')
  @UseGuards(jwtGuard)
  getProtected(@currentUser() user: user) {
    return user;
  }
  @Get('google/login')
  @UseGuards(googleGuard)
  googleLogin() {}
  @Get('google/redirect')
  @UseGuards(googleGuard)
  googleRedirect(@Req() req: any) {
    return this.authServices.googleLogin(req.user);
  }
  @UseGuards(jwtGuard)
  @Delete()
  deleleUser(@currentUser() user: user) {
    return this.authServices.deleteUser(user.id);
  }
}
