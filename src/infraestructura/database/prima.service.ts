import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      transactionOptions: {
        maxWait: 1000 * 60, // 0.5 minutes
        timeout: 1000 * 60 * 6, // 6 minutes
      },
      datasources: {
        db: {
          url:
            process.env.NODE_ENV === 'test'
              ? process.env.DATABASE_TEST_URL
              : process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.info('Database ERROR: ', error.message);
      await this.$disconnect();
    }
  }

  async onModuleDestroy() {
    await await Promise.all([this.$disconnect()]);
  }
}
