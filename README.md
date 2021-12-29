## Description

Payment APP is an application to handle deposits and withdrawals for customers. Also generates reports of transactions of all unique users for given timestamp.

Endpoints: <br />
  Customers endpoints: <br />
  GET   - /customers -> returns all customers in database<br />
<br />
  POST  - /customers -> saves a customer in db with given json data like example below:<br />
  ```bash
        {
          "firstName": "firstName",
          "lastName": "lastName",
          "gender": "gender",
          "email": "email@email.com",
          "country": "country"
        }
  ```
<br />
  PUT   - /customers/:customerId -> updates a customer based on data given like in example when you get a customer<br />
<br />
  Transactions endpoints:<br /><br />
  POST  - /transactions/deposits/:customerId -> makes a deposit for an user with id customerId with request body like example below:<br />
  ```bash
        	{
            "amount": 100
          }
  ```
  <br />
  POST  - /transactions/withdrawals/:customerId -> makes a withdrawal for an user with id customerId with request body like example below:<br />
  ```bash
        	{
            "amount": 100
          }
  ```

<br />
  GET   - /transactions/report -> returns report for transactions <br />
        params: fromDate, toDate ex: /transactions/report?fromDate=2021-11-24T23:00:00.000Z&toDate=2021-12-30T23:00:00.000Z<br />
        default: returns report for transactions last 7 days<br />

## Installation

```bash
$ npm install
```

## Running the app

create database test; (or any other name)<br />

Provide the json for connecting to the database in ormconfig.json file at root folder (example below):<br />
```bash
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
```


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
