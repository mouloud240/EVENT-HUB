import { HttpException, Injectable } from '@nestjs/common';
import { SpecificMailDto } from './dto/create-mailer.dto';
import { MailAllDto } from './dto/sendMailAll.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { prismaService } from 'src/db/prisma.service';

@Injectable()
export class IMailerService {
  constructor(private readonly mailer:MailerService,private readonly db:prismaService){  }
  sendMailParticuler(SpecificMailDto: SpecificMailDto) {
    return this.mailer.sendMail({
      to: SpecificMailDto.to,
      subject: SpecificMailDto.subject,
      text: SpecificMailDto.body,
    })

  }
 async sendMailToAll(MailToAllDto:MailAllDto) {
    try {
const users=await this.db.user.findMany()
    users.map((user)=>this.sendMailParticuler({to:user.email,subject:MailToAllDto.subject,body:MailToAllDto.body})) 
    }catch(e){
   throw new HttpException(e,500)
    }
  return {"message":"Mail sent to all users"}
  }
  
  }
