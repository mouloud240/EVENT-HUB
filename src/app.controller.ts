import { Controller, ForbiddenException, Get, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hi';
  }
  @Get('un')
   getun(): string {
    console.log('un');
    throw new ForbiddenException();
  }
}
