import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CustomerDto, CustomerRO } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

const MIN_PERCENTAGE = 5
const MAX_PERCENTAGE = 20

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customersRepository: Repository<CustomerEntity>
    ) {}

  async showAll(): Promise<CustomerRO[]> {
    const customers = await this.customersRepository.find();
    return customers.map(customer => customer.toResponseObject());
  }

  async create(createCustomer: CustomerDto): Promise<CustomerRO> {
    const customerWithEmail = await this.customersRepository.findOne({ where: {email: createCustomer.email}})
    if(customerWithEmail) {
      throw new BadRequestException('Another user exists with this email. Try another one');
    }
    
    let customer = new CustomerEntity();
    customer.firstName = createCustomer.firstName
    customer.lastName = createCustomer.lastName
    customer.gender = createCustomer.gender
    customer.country = createCustomer.country
    customer.email = createCustomer.email
    customer.balance = 0;
    customer.bonusBalance = 0;
    customer.bonusRate = Math.floor(Math.random() * (MAX_PERCENTAGE - MIN_PERCENTAGE) + MIN_PERCENTAGE + 1);
    return await this.customersRepository.save(customer);
  }

  async update(id: number, updateCustomer: UpdateCustomerDto): Promise<CustomerRO> {
    const customer = await this.customersRepository.findOne({ where: {id}});
    if (!customer) {
      throw new NotFoundException('Not found customer');
    }
    const customerWithEmail = await this.customersRepository.findOne({ where: {email: updateCustomer.email}})
    if(customerWithEmail && customer.email != customerWithEmail.email) {
      throw new BadRequestException('Another user exists with this email. Try another one');
    }

    customer.firstName = updateCustomer.firstName
    customer.lastName = updateCustomer.lastName
    customer.gender = updateCustomer.gender
    customer.country = updateCustomer.country
    customer.email = updateCustomer.email
    await this.customersRepository.save(customer);
    
    const updatedCustomer = await this.customersRepository.findOne({ where: {id}});
    return updatedCustomer.toResponseObject()
  }
}
