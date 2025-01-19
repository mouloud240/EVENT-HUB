import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from './mailer.controller';
import { IMailerService } from './mailer.service';
import { prismaService } from 'src/db/prisma.service';

describe('MailerController', () => {
  let controller: MailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [IMailerService,prismaService],
    }).compile();

    controller = module.get<MailerController>(MailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
