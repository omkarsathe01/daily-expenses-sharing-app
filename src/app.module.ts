import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './expenses/expenses.module';
import { BalanceSheetModule } from './balance-sheet/balance-sheet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_CONNECTION_STRING,
      database: process.env.MONGODB_DATABASE,
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    ExpensesModule,
    BalanceSheetModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
