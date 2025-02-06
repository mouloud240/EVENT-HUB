import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class prismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(prismaService.name);
  onModuleInit() {
    this.$connect()
      .then(() => this.logger.log('connect To the Database'))
      .catch((e) => {
        this.logger.error(e);
      });
  }
  onModuleDestroy() {
    this.$disconnect()
      .then(() => this.logger.log('disconnect from the Database'))
      .catch((e) => this.logger.error(e));
  }

  constructor() {
    super();
  }
}
