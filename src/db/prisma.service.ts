import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
@Injectable()
export class prismaService extends PrismaClient implements OnModuleInit ,OnModuleDestroy{
    onModuleInit() {
      this.$connect().catch((e)=>{
      Logger.error(e)
    })
    }
    onModuleDestroy() {
    this.$disconnect()
    }

  constructor(){
    super()
  }
} 
