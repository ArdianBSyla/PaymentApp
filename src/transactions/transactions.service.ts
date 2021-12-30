import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/customers/customer.entity';
import { CustomerRO } from 'src/customers/dto/customer.dto';
import { getConnection, Repository } from 'typeorm';
import { DepositEntity } from './deposit.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionEntity } from './transaction.entity';
import { WithdrawEntity } from './withdrawals.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionsRepository: Repository<TransactionEntity>,
    @InjectRepository(DepositEntity)
    private depositsRepository: Repository<DepositEntity>,
    @InjectRepository(WithdrawEntity)
    private withdrawalsRepository: Repository<WithdrawEntity>,
    @InjectRepository(CustomerEntity)
    private customersRepository: Repository<CustomerEntity>,
  ) {}

  async createDeposit(customerId: number, depositReq: DepositDto): Promise<CustomerRO> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customersRepository.findOne({where: {id: customerId}})
      if(!customer) {
        throw new HttpException(`Customer with given id does not exist`, HttpStatus.BAD_REQUEST)
      }

      const transaction = await this.transactionsRepository.create({customer: customer})
      await this.transactionsRepository.save(transaction);

      const deposit  = await this.depositsRepository.create({amount: depositReq.amount, transaction: transaction})
      await this.depositsRepository.save(deposit);

      const depositsCount = await this.transactionsRepository
        .createQueryBuilder('transactions')
        .innerJoin('transactions.deposit', 'deposits')
        .select('count(*)')
        .where(`transactions.customerId = ${customerId}`)
        .getCount()

      if((depositsCount) %3 === 0) {
        await this.customersRepository.increment({id: customerId}, 'balance', depositReq.amount)
        await this.customersRepository.increment({id: customerId}, 'bonusBalance', Math.round(depositReq.amount/100 * customer.bonusRate))
      } else {
        await this.customersRepository.increment({id: customerId}, 'balance', depositReq.amount)
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    
    const updatedCustomer = await this.customersRepository.findOne({id: customerId})
    return updatedCustomer.toResponseObject();
  }

  async createWithdraw(customerId: number, withdrawReq: WithdrawDto) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customersRepository.findOne({where: {id: customerId}})
      if(!customer) {
        throw new HttpException(`Customer not found`, HttpStatus.BAD_REQUEST)
      }

      if(customer.balance < withdrawReq.amount) {
        throw new HttpException(`You do not have enough balance to withdraw`, HttpStatus.BAD_GATEWAY)
      }

      const transaction = await this.transactionsRepository.create({customer: customer})
      await this.transactionsRepository.save(transaction);

      const withdraw  = await this.withdrawalsRepository.create({amount: withdrawReq.amount, transaction: transaction})
      this.withdrawalsRepository.save(withdraw);

      await this.customersRepository.decrement({id: customerId}, 'balance', withdrawReq.amount)
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    const updatedCustomer = await this.customersRepository.findOne({id: customerId})
    return updatedCustomer.toResponseObject();
  }

  async readReport(fromDate: Date, toDate: Date) {
    let date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    let dateFrom = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    date = new Date();
    let dateTo = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
    if(fromDate) {
      date = new Date(fromDate);
      dateFrom = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
      if(toDate) {
        date = new Date(toDate);
        dateTo = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
      } else {
        date = new Date(date.valueOf() + 7 * 24 * 60 * 60 * 1000);
        dateTo = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
      }
    } 
    

    let whereClause = 'true'
    whereClause = `DATE(t.date) >= '${dateFrom}' AND DATE(t.date) <= '${dateTo}'`

    const report = await this.customersRepository.createQueryBuilder('customers')
      .innerJoin('customers.transactions', 't', 'customers.id = t.customerId')
      .leftJoin('t.deposit', 'd', 't.id = d.transactionId')
      .leftJoin('t.withdrawal', 'w', 't.id = w.transactionId')
      .select('DATE(t.date)', 'date')
      .addSelect('country')
      .addSelect('count( distinct t.customerId)', 'numberOfCustomers')
      .addSelect('count(d.id)', 'numberOfDeposits')
      .addSelect('sum(d.amount)', 'totalDepositAmount')
      .addSelect('count(w.id)', 'numberOfWithdrawals')
      .addSelect('sum(w.amount)', 'totalWithdrawalAmount')
      .where(whereClause)
      .groupBy('DATE(t.date), country')
      .getRawMany()

      return report;
  }
}
