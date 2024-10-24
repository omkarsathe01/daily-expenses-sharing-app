import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  findAll(): Promise<ExpenseResponseDto[]> {
    return this.expensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
  //   return this.expensesService.update(+id, updateExpenseDto);
  // }

  @Delete()
  remove(@Body() id: string) {
    return this.expensesService.remove(id);
  }
}
