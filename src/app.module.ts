import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forRoot(), CustomersModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_FILTER,
    useClass: HttpErrorFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  }

  ],
})
export class AppModule {}
