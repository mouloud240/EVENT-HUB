import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IMailerService, } from './mailer.service';
import { SpecificMailDto } from './dto/create-mailer.dto';
import { MailAllDto } from './dto/sendMailAll.dto';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: IMailerService) {}
  @ApiProperty({description:"Send mail to a particular user"})
  @ApiResponse({status:201,description:"Mail Properties"})
  @Post()
  sendMailParticuler(@Body() SpecificMailDto:SpecificMailDto) {
    return this.mailerService.sendMailParticuler(SpecificMailDto);
  }

  @ApiProperty({description:"Send mail to all users"})
  @ApiResponse({status:201,description:"Mail Properties"})
  @Post('all')
  sendMailToAll(@Body() mailAlldto:MailAllDto) {
    return this.mailerService.sendMailToAll(mailAlldto);
  }
}

