import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;
  
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  balance: number;
  bonusBalance: number;
  bonusRate: number;
}

export class CustomerRO {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  country: string;
  balance: number;
  bonusBalance: number;
  bonusRate: number;
}