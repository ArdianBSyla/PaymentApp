import { IsNotEmpty, IsPositive } from "class-validator";

export class TransactionDto {
  @IsNotEmpty()
  @IsPositive()
  readonly amount: number;
}

export class TransactionRO {
  customerId: number;
  transactionId: number;
  depositId: number; 
  amount: number;
  date: Date;
}