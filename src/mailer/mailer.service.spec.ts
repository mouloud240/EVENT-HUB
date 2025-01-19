import { Test, TestingModule } from '@nestjs/testing';
import { IMailerService } from './mailer.service';
import { prismaService } from 'src/db/prisma.service';

describe('MailerService', () => {
  let service: IMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IMailerService,prismaService],
    }).compile();

    service = module.get<IMailerService>(IMailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
