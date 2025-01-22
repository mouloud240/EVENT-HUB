import { HttpException, Injectable } from '@nestjs/common';
import { SpecificMailDto } from './dto/create-mailer.dto';
import { MailAllDto } from './dto/sendMailAll.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { prismaService } from 'src/db/prisma.service';

@Injectable()
export class IMailerService {
  constructor(
    private readonly mailer: MailerService,
    private readonly db: prismaService,
  ) {}
  sendMailParticuler(SpecificMailDto: SpecificMailDto) {
    return this.mailer.sendMail({
      to: SpecificMailDto.to,
      subject: SpecificMailDto.subject,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #007BFF;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #007BFF;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 0 0 15px;
            color: #555555;
        }
        .content a {
            color: #007BFF;
            text-decoration: none;
        }
        .content a:hover {
            text-decoration: underline;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #007BFF;
            font-size: 12px;
            color: #777777;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff !important;
            background-color: #007BFF;
            border-radius: 5px;
            text-decoration: none;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>EVENT HUB</h1>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>I hope this message finds you well. I am writing to You about ${SpecificMailDto.subject}. Please find the details below:</p>
            <p>
                <strong>Subject:</strong> ${SpecificMailDto.subject}<br>
                <strong>Date:</strong> ${new Date()}<br>
                <strong>Location:</strong> [Location, if applicable]
            </p>
            <p>${SpecificMailDto.body}</p>
            <p>Thank you for your attention to this matter. I look forward to your response.</p>
            <p>Best regards,</p>
            <p>[Mouloud Hasrane]<br>
            CEO<br>
            EVENTHUB<br>
            +213696070598</p>
${SpecificMailDto.callToAction ? `<a href="${SpecificMailDto.ctaLink}" class="button">${SpecificMailDto.callToAction}</a>` : ''}
        </div>
        <div class="footer">
            <p>You are receiving this email because you are a valued contact of [Your Company Name].</p>
            <p><a href="localhost:3000/Unsubscribe/5">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
<a href="https://www.instagram.com/mld.rar" > check Our instgram  </a>
    <p>© 2024 EVENTHUB. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
    });
  }
  async sendMailToAll(MailToAllDto: MailAllDto) {
    try {
      const users = await this.db.user.findMany();
      users.map((user) =>
        this.sendMailParticuler({
          to: user.email,
          subject: MailToAllDto.subject,
          body: MailToAllDto.body,
        }),
      );
    } catch (e) {
      throw new HttpException(e, 500);
    }
    return { message: 'Mail sent to all users' };
  }
  async sendMailToMultiple(mails: string[], MailToAllDto: MailAllDto) {
    try {
      mails.map((mail) =>
        this.sendMailParticuler({
          to: mail,
          subject: MailToAllDto.subject,
          body: MailToAllDto.body,
        }),
      );
    } catch (e) {
      throw new HttpException(e, 500);
    }
    return { message: 'Mail sent to all users' };
  }
}
