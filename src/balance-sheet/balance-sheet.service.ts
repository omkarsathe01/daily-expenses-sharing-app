import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BalanceSheetService {
  constructor(private readonly usersService: UsersService) {}

  async generateBalanceSheet(): Promise<string> {
    const users = await this.usersService.findAll();
    const records = users.map((user) => ({
      email: user.email,
      balance: user.balance,
      dues: user.dues.map((due) => `${due.email}: ${due.amount}`).join(', '),
    }));

    const csvWriter = createObjectCsvWriter({
      path: 'balance-sheet.csv',
      header: [
        { id: 'email', title: 'Email' },
        { id: 'balance', title: 'Balance' },
        { id: 'dues', title: 'Dues' },
      ],
    });

    await csvWriter.writeRecords(records);
    return 'balance-sheet.csv';
  }
}
