import { Test, TestingModule } from '@nestjs/testing';
import { IMailerService } from './mailer.service';

describe('MailerService', () => {
  let service: IMailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IMailerService],
    }).compile();

    service = module.get<IMailerService>(IMailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
