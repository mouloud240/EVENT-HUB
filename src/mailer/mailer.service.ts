import { Injectable } from '@nestjs/common';
import { SpecificMailDto } from './dto/create-mailer.dto';
import { MailAllDto } from './dto/sendMailAll.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class IMailerService {
  constructor(private readonly mailer:MailerService){  }
  sendMailParticuler(SpecificMailDto: SpecificMailDto) {
    console.log(process.env.MAIL)
    console.log(process.env.PASS)
    return this.mailer.sendMail({
      to: SpecificMailDto.to,
      subject: SpecificMailDto.subject,
      text: SpecificMailDto.body,
    })

  }
 sendMailToAll(MailToAllDto:MailAllDto) {
   return "This send Email to all users"
  }
  }
