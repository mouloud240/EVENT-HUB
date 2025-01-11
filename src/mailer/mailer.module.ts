import { Module } from '@nestjs/common';
import { IMailerService} from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports:[
    PrismaModule,
   MailerModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
 useFactory:async(configService:ConfigService)=>(
        {
                
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user:configService.get<string>("MAIL"), // Email
          pass:configService.get<string>('PASS'), // Password
    },
  },
        } 
 )
    }), 
  ],
  controllers: [MailerController],
  providers: [IMailerService],
})
export class IMailerModule {}
