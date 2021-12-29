import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/customers/customer.entity';
import { CustomersService } from 'src/customers/customers.service';
import { DepositEntity } from './deposit.entity';
import { TransactionEntity } from './transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { WithdrawEntity } from './withdrawals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, CustomerEntity, DepositEntity, WithdrawEntity])],
  controllers: [TransactionsController],
  providers: [TransactionsService, CustomersService]
})
export class TransactionsModule {}
