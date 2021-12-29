## Description

Payment APP is an application to handle deposits and withdrawals for customers. Also generates reports of transactions of all unique users for given timestamp.

Endpoints: 
  Customers endpoints:
  GET   - /customers -> returns all customers in database

  POST  - /customers -> saves a customer in db with given json data like example below:
        {
          "firstName": "firstName",
          "lastName": "lastName",
          "gender": "gender",
          "email": "email@email.com",
          "country": "country"
        }

  PUT   - /customers/:customerId -> updates a customer based on data given like in example for create


  Transactions endpoints:
  POST  - /transactions/deposits/:customerId -> makes a deposit for an user with id customerId with request body like example below:
        	{
            "amount": 100
          }

  POST  - /transactions/withdrawals/:customerId -> makes a withdrawal for an user with id customerId with request body like example below:
        	{
            "amount": 100
          }

  GET   - /transactions/report -> returns report for transactions 
        params: fromDate, toDate ex: /transactions/report?fromDate=2021-11-24T23:00:00.000Z&toDate=2021-12-30T23:00:00.000Z
        default: returns report for transactions last 7 days

## Installation

```bash
$ npm install
```

## Running the app

create database test; (or any other name)

Provide the json for connecting to the database in ormconfig.json file at root folder (example below):
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
