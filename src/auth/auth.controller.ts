import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { localGuard } from './guards/local.guard';
import { currentUser } from './decorators/getUser.decorator';
import { user } from '@prisma/client';
import { AuthService } from './auth.service';
import { jwtGuard } from './guards/jwt.guard';
import { loginReqDto } from './dto/login.req.dto';
import { googleGuard } from './guards/google.guard';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServices: AuthService,
    private readonly ConfigService: ConfigService,
  ) {}
  @Post('login')
  @UseGuards(localGuard)
  login(@currentUser() user: user, @Body() body: loginReqDto) {
    return this.authServices.login(user);
  }
  @Post('refresh')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authServices.validateRefreshToken(body.refreshToken);
  }

  @Get('protected')
  @UseGuards(jwtGuard)
  getProtected(@currentUser() user: user) {
    return this.authServices.getUserById(user.id);
  }
  @Get('google/login')
  @UseGuards(googleGuard)
  googleLogin() {}
  @Get('google/redirect')
  @UseGuards(googleGuard)
  async googleRedirect(@Req() req: any, @Res() res: any) {
    const user = await this.authServices.googleLogin(req.user);
    const frontendRedirectUrl = `${this.ConfigService.get('FRONTEND_URL')}/login/google-redirect?accessToken=${user.AccessToken}&refreshToken=${user.RefreshToken}`;
    res.redirect(frontendRedirectUrl);
  }
  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authServices.register(user);
  }

  @UseGuards(jwtGuard)
  @Delete()
  deleleUser(@currentUser() user: user) {
    return this.authServices.deleteUser(user.id);
  }
}
