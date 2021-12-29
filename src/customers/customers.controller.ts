import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {

  constructor(private customersService: CustomersService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() customer: CustomerDto) {
    return this.customersService.create(customer)
  }

  @Get()
  @UsePipes(new ValidationPipe())
  findAll() {
    return this.customersService.showAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id, @Body() customer: UpdateCustomerDto) {
    return this.customersService.update(id, customer);
  }
}
