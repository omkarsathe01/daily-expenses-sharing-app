import { Module } from '@nestjs/common';
import { BalanceSheetService } from './balance-sheet.service';
import { BalanceSheetController } from './balance-sheet.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [BalanceSheetController],
  providers: [BalanceSheetService],
})
export class BalanceSheetModule {}
