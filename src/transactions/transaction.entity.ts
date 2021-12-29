import { CustomerEntity } from "src/customers/customer.entity";
import { CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DepositEntity } from "./deposit.entity";
import { WithdrawEntity } from "./withdrawals.entity";

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => CustomerEntity, customer => customer.transactions)
  customer: CustomerEntity

  @OneToOne(() => DepositEntity, deposit => deposit.transaction)
  deposit: DepositEntity

  @OneToOne(() => WithdrawEntity, withdrawal => withdrawal.transaction)
  withdrawal: WithdrawEntity

  toResponseObject(){
    const { id } = this;
    return { id }; 
  }
}