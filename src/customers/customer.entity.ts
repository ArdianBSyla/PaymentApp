import { TransactionEntity } from "src/transactions/transaction.entity";
import { Column, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerRO } from "./dto/customer.dto";

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  country: string;

  @Column()
  balance: number;

  @Column()
  bonusBalance: number;

  @Column()
  bonusRate: number;

  @OneToMany(() => TransactionEntity, transaction => transaction.customer)
  transactions: TransactionEntity[];

  toResponseObject(): CustomerRO{
    const responseObject: any = {...this}
    return responseObject;
  }

}