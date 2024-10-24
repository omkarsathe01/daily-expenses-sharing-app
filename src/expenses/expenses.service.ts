import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto, UserShareDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, SplitType } from './entities/expense.entity';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const { amount, description, paid_to, paid_by, shares, split_type } =
      createExpenseDto;

    const paidByUser = await this.usersService.findOneByEmail(paid_by);
    if (!paidByUser) {
      throw new NotFoundException({ message: `${paid_by} does not exist.` });
    }

    const newExpense: DeepPartial<Expense> = {
      date: new Date().toISOString(),
      amount,
      description,
      paid_to,
      paid_by,
      split_type,
      shares: [],
    };

    const savedExpense = await this.expenseRepository.save(newExpense);

    if (paid_to[0]?.email) {
      let receiverUser = await this.usersService.findOneByEmail(
        paid_to[0].email,
      );
      if (receiverUser) {
        receiverUser.balance += amount;
      } else {
        receiverUser = await this.usersService.createUserByEmail({
          email: paid_to[0].email,
        });
        receiverUser.balance += amount;
      }

      receiverUser.transaction_history.push(savedExpense.id.toString());
      await this.usersService.update(paid_to[0].email, receiverUser);
    }

    // Update payer's balance
    paidByUser.balance -= amount;

    await this.usersService.update(paid_by, paidByUser);

    // Handle different split types
    switch (split_type) {
      case SplitType.EQUAL:
        await this.handleEqualSplit(shares, amount, paid_by, savedExpense);
        break;
      case SplitType.EXACT:
        await this.handleExactSplit(shares, amount, paid_by, savedExpense);
        break;
      case SplitType.PERCENT:
        await this.handlePercentSplit(shares, amount, paid_by, savedExpense);
        break;
      default:
        throw new BadRequestException('Invalid split type');
    }

    return savedExpense;
  }

  private async handleEqualSplit(
    shares: UserShareDto[],
    totalAmount: number,
    paidBy: string,
    expense: Expense,
  ) {
    const amountPerUser = totalAmount / shares.length;

    for (const share of shares) {
      share.percent = null;
      await this.updateUserShare(share, paidBy, amountPerUser, expense);
    }

    await this.update(expense.id, expense);
  }

  private async handleExactSplit(
    shares: UserShareDto[],
    totalAmount: number,
    paidBy: string,
    expense: Expense,
  ) {
    const calculatedAmount = shares.reduce(
      (sum, share) => sum + (share.amount || 0),
      0,
    );

    if (calculatedAmount !== totalAmount) {
      throw new BadRequestException(
        `Total shared amount (${calculatedAmount}) does not match the expense amount (${totalAmount}).`,
      );
    }

    for (const share of shares) {
      if (share.amount === undefined) {
        throw new BadRequestException(
          'Please specify the exact amount for each share.',
        );
      }

      await this.updateUserShare(share, paidBy, share.amount, expense);
    }

    await this.update(expense.id, expense);
  }

  private async handlePercentSplit(
    shares: UserShareDto[],
    totalAmount: number,
    paidBy: string,
    expense: Expense,
  ) {
    const totalPercentage = shares.reduce(
      (sum, share) => sum + (share.percent ?? 0),
      0,
    );

    if (totalPercentage !== 100) {
      throw new BadRequestException(
        'Total percentage does not add up to 100%.',
      );
    }

    for (const share of shares) {
      if (!share.percent) {
        throw new BadRequestException(`Missing percentage for ${share.email}.`);
      }

      const userAmount = (share.percent / 100) * totalAmount;

      await this.updateUserShare(share, paidBy, userAmount, expense);
    }

    await this.update(expense.id, expense);
  }

  private async updateUserShare(
    share: UserShareDto,
    paidBy: string,
    amount: number,
    expense: Expense,
  ) {
    let user = await this.usersService.findOneByEmail(share.email);
    if (!user) {
      user = await this.usersService.createUserByEmail({ email: share.email });
    }

    expense.shares?.push({
      email: share.email,
      amount,
      percent: share.percent || null,
    });

    if (share.email !== paidBy) {
      const existingDue = user.dues.find((due) => due.email === paidBy);
      if (existingDue) {
        existingDue.amount += amount;
      } else {
        user.dues.push({ email: paidBy, amount });
      }
    }

    user.transaction_history.push(expense.id.toString());

    await this.usersService.update(user.email, user);
  }

  async findAll() {
    return await this.expenseRepository.find();
  }

  findOne(id: string) {
    return this.expenseRepository.findOneBy({ id: new ObjectId(id) });
  }

  async update(id: ObjectId, updateExpenseDto: UpdateExpenseDto) {
    return await this.expenseRepository.update({ id }, updateExpenseDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.expenseRepository.delete({ id: new ObjectId(id) });
  }
}
