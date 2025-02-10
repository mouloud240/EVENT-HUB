import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { localGuard } from './guards/local.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { testGuard } from './test.guard';
import { jwtStrategy } from './strategies/jwt.startegy';
import { googleStrategy } from './strategies/google.strategy';
import { googleGuard } from './guards/google.guard';
import { SessionSerializer } from './sessionSerilizer';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [
    AuthService,
    localGuard,
    LocalStrategy,
    testGuard,
    jwtStrategy,
    googleStrategy,
    googleGuard,
    SessionSerializer,
  ],
})
export class AuthModule {}
