import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService,
  ){}

  @Post('/deposits/:customerId')
  @UsePipes(new ValidationPipe())
  createDeposit(
    @Param('customerId', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) customerId,
    @Body() depositReq: TransactionDto) {
      return this.transactionsService.createDeposit(customerId, depositReq)
  }

  @Post('/withdrawals/:customerId')
  @UsePipes(new ValidationPipe())
  createWithdraw(
    @Param('customerId', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) customerId,
    @Body() withdrawReq: TransactionDto) {
      if(withdrawReq.amount > 100) {
        throw new HttpException('Cannot withdraw more than 100 EUR', HttpStatus.BAD_REQUEST)
      }
      return this.transactionsService.createWithdraw(customerId, withdrawReq);
  }

  @Get('report')
  getReport(@Query('fromDate') fromDate: Date, @Query('toDate') toDate: Date) {
    return this.transactionsService.readReport(fromDate, toDate);
  }

}
