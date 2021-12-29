import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionEntity } from "./transaction.entity";

@Entity('deposits')
export class DepositEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TransactionEntity, transaction => transaction.deposit)
  @JoinColumn()
  transaction: TransactionEntity;

  @Column()
  amount: number

  toResponseObject(){
    const { id } = this;
    return { id }; 
  }
}