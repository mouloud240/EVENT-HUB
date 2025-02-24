import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { user } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResDto } from './dto/login.res.dto';
import { refreshToken } from './dto/refreshToken.dto';
import { Profile } from 'passport-google-oauth20';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isHttpException } from './strategies/typeGuards/isHttpExeption';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtModule: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async getUserById(id: string): Promise<user> {
    return this.userService.findOne(id);
  }
  async register(user: CreateUserDto): Promise<LoginResDto> {
    try {
      const newUser = await this.userService.create(user);
      return this.login(newUser);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new HttpException(
          'User Already Exist Please login With your Email and Password',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async deleteUser(id: string) {
    return this.userService.remove(id);
  }
  async googleLogin(user: Profile) {
    try {
      const userWithGoogleMail = await this.userService.findByEmail(
        user.emails[0].value,
      );

      //check if there is already a user with this email
      if (!userWithGoogleMail) {
        const newUser = await this.userService.createGoogleUser(user);
        return this.login(newUser);
      }
      //check if user logged before with his googleId
      const googleIdExists = userWithGoogleMail.googleId != null;
      if (googleIdExists) {
        return this.login(userWithGoogleMail);
      }
      // if there is a mail but no googleId we put it in the db
      const updateUserDto = new UpdateUserDto();
      updateUserDto.googleId = user.id;
      await this.userService.update(userWithGoogleMail.id, updateUserDto);
      return this.login(userWithGoogleMail);
    } catch (error: unknown) {
      if (isHttpException(error)) {
        throw error;
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(email: string, password: string): Promise<user> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('email or password is incorrect');
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnauthorizedException('email or password is incorrect');
    }
    return user;
  }
  login(user: user): LoginResDto {
    const payload = { id: user.id };
    const AccesToken = this.jwtModule.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });
    const refreshToken = this.jwtModule.sign(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return {
      AccessToken: AccesToken,
      RefreshToken: refreshToken,
      user: result,
    };
  }
  async validateRefreshToken(token: string): Promise<refreshToken> {
    const payload = this.jwtModule.verify(token, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });
    const newPayload = { id: payload.id };
    const newAccessToken = this.jwtModule.sign(newPayload, {
      secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXPIRES_IN'),
    });
    const newRefreshToken = this.jwtModule.sign(newPayload, {
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRES_IN'),
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
