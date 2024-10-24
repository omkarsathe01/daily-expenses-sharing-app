<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <h1 align="center">Daily Expenses Sharing API</h1>

<p align="center">
  <a href="https://sonarcloud.io/summary/new_code?id=omkarsathe01_daily-expenses-sharing-app">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=omkarsathe01_daily-expenses-sharing-app&metric=alert_status" alt="Quality Gate Status">
  </a>
</p>

## Overview

This API facilitates the management of users, expenses, and balance sheets for a daily expenses sharing application. It allows users to register, create and track shared expenses, and download balance sheets. The application supports various expense split types: equal, exact, and percentage-based.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
    * [Users](#users)
    * [Expenses](#expenses)
    * [Balance Sheet](#balance-sheet)
4. [Schemas](#schemas)
5. [Technologies Used](#technologies-used)
6. [License](#license)

## Features

* **User management**: create, retrieve, and delete users.
* **Expense management**: add, view, and split expenses between multiple users.
* Downloadable balance sheet report.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/omkarsathe01/daily-expenses-sharing-app
   cd daily-expenses-sharing-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (update the [.env](https://github.com/omkarsathe01/daily-expenses-sharing-app/blob/master/.env.example) file with your database and other credentials).

   ```bash
   cp .env.example .env
   ```

4. Run the application:

   ```bash
   npm run start
   ```

## API Endpoints

### Users

| Method | Endpoint   | Description                    | Request Body	 | Response                    |
|--------|------------|--------------------------------|---------------|-----------------------------|
| POST   | /users     | Create a new user              | CreateUserDto | UserResponseDto             |
| GET    | /users     | Retrieve all users             | N/A           | UserResponseDto[]           |
| GET    | /users/:id | Retrieve a specific user by ID | N/A           | UserResponseDto or empty {} |
| DELETE | /users     | Delete a user by email         | EmailDto      | Success or failure message  |

#### Request Body: CreateUserDto

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "balance": 1000
}
```

#### Response Body: UserResponseDto

```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "balance": 1000,
  "dues": [
    {
      "email": "jane@example.com",
      "amount": 50
    }
  ],
  "transaction_history": ["60c72b2f5b2c5c0017df3f12"],
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z"
}
```

### Expenses

| Method | Endpoint      | Description                       | Request Body	          | Response                   |
|--------|---------------|-----------------------------------|------------------------|----------------------------|
| POST   | /expenses     | Create a new expense              | CreateExpenseDto       | ExpenseResponseDto         |
| GET    | /expenses     | Retrieve all expenses             | N/A                    | ExpenseResponseDto[]       |
| GET    | /expenses/:id | Retrieve a specific expense by ID | N/A                    | ExpenseResponseDto         |
| DELETE | /expenses     | Delete an expense by ID           | Expense ID (as string) | Success or failure message |

#### Request Body: CreateExpenseDto

```json
{
  "amount": 500,
  "description": "Dinner at a restaurant",
  "paid_to": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "paid_by": "jane@example.com",
  "split_type": "equal",
  "shares": [
    {
      "email": "john@example.com",
      "amount": 250
    },
    {
      "email": "jane@example.com",
      "amount": 250
    }
  ]
}
```

#### Response Body: ExpenseResponseDto

```json
{
  "amount": 500,
  "description": "Dinner at a restaurant",
  "paid_to": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "paid_by": "jane@example.com",
  "split_type": "equal",
  "shares": [
    {
      "email": "john@example.com",
      "amount": 250
    },
    {
      "email": "jane@example.com",
      "amount": 250
    }
  ],
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

### Balance Sheet

| Method | Endpoint                | Description                              | Request Body	 | Response |
|--------|-------------------------|------------------------------------------|---------------|----------|
| GET    | /balance-sheet/download | Download the balance sheet as a CSV file | N/A           | CSV file |

## Schemas

### User Entity

| Field               | Type           | Description                                      |
|---------------------|----------------|--------------------------------------------------|
| id                  | ObjectId       | Unique identifier for the user                   |
| user_id             | number         | Unique user ID                                   |
| name                | string         | Name of the user                                 |
| email               | string         | Email of the user                                |
| mobile              | string         | Mobile number of the user                        |
| balance             | number         | Balance of the user                              |
| dues                | UserAmount[]   | List of dues the user owes or is owed            |
| transaction_history | string[]       | List of transaction history IDs                  |
| isActive            | boolean        | Whether the user is active                       |
| created_at          | Date           | Date when the user was created                   |
| updated_at          | Date           | Date when the user was last updated              |

### Expense Entity

| Field       | Type           | Description                               |
|-------------|----------------|-------------------------------------------|
| id          | ObjectId       | Unique identifier for the expense         |
| amount      | number         | Total amount of the expense               |
| description | string         | Description of the expense                |
| paid_to     | ReceiverUser[] | List of users who received the payment    |
| paid_by     | string         | Email of the user who paid                |
| split_type  | SplitType      | The type of split (equal, exact, percent) |
| shares      | UserShare[]    | List of how the expense was shared        |
| created_at  | Date           | Date when the expense was created         |


## Technologies Used

* Node.js
* NestJS
* MongoDB (via TypeORM)
* Class-Validator and Class-Transformer

## Stay in touch

- Author - [Omkar Sathe](https://omkarsathe.com/)

## License

This project is licensed under the [MIT License](https://github.com/omkarsathe01/daily-expenses-sharing-app/blob/main/LICENSE).
