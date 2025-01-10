import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IMailerService, } from './mailer.service';
import { SpecificMailDto } from './dto/create-mailer.dto';
import { MailAllDto } from './dto/sendMailAll.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: IMailerService) {}
  @Post()
  sendMailParticuler(@Body() SpecificMailDto:SpecificMailDto) {
    return this.mailerService.sendMailParticuler(SpecificMailDto);
  }

  @Post('all')
  sendMailToAll(@Body() mailAlldto:MailAllDto) {
    return this.mailerService.sendMailToAll(mailAlldto);
  }
}

