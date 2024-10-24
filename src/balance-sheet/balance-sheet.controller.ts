import { Controller, Get, Res } from '@nestjs/common';
import { BalanceSheetService } from './balance-sheet.service';
import { Response } from 'express';
import { join } from 'path';

@Controller('balance-sheet')
export class BalanceSheetController {
  constructor(private readonly balanceSheetService: BalanceSheetService) {}

  @Get('download')
  async downloadBalanceSheet(@Res() res: Response): Promise<void> {
    const filePath = await this.balanceSheetService.generateBalanceSheet();

    const currentTime = new Date();
    const path = `balance-sheet-${currentTime.getFullYear()}-${currentTime.getDate()}-${currentTime.getMonth() + 1}.csv`;
    console.log(path);

    res.download(join(process.cwd(), filePath), path, (err) => {
      if (err) {
        res.status(500).send('Could not download the file.');
      }
    });
  }
}
