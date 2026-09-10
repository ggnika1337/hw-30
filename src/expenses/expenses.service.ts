import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './schemas/expense.schema';
import { User } from 'src/users/schemas/user.schema';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import { ExpenseQueries } from './dtos/expenseQuery.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<Expense>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getExpenses(
    userId: string,
    { category, priceFrom, priceTo, page, take }: ExpenseQueries,
  ) {
    const filter: any = { owner: userId };

    if (category) filter.category = category;
    if (priceFrom !== undefined)
      filter.price = { ...filter.price, $gte: priceFrom };
    if (priceTo !== undefined)
      filter.price = { ...filter.price, $lte: priceTo };

    return this.expenseModel
      .find(filter)
      .skip((page - 1) * take)
      .limit(take);
  }

  async getTopSpenders() {
    return this.userModel
      .find()
      .select('_id fullName totalSpent')
      .sort({ totalSpent: -1 })
      .limit(10);
  }

  async getStatistics(category: string, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const expenses = await this.expenseModel.find({
      owner: user._id,
      category: category,
    });

    let count = 0;
    expenses.forEach((expense) => {
      count += expense.totalPrice;
    });

    const toReturn = {
      expensesCount: expenses.length,
      totalSpentInCategory: count,
      expenses: expenses,
    };

    return toReturn;
  }

  async createExpense(userId: string, dto: CreateExpenseDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const expense = await this.expenseModel.create({
      ...dto,
      totalPrice: dto.quantity * dto.price,
      owner: user._id,
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { expenses: expense._id },
      $inc: { totalSpent: dto.quantity * dto.price },
    });

    return expense;
  }

  async getExpenseById(expenseId: string, userId: string) {
    const expense = await this.expenseModel.findOne({
      _id: expenseId,
      owner: userId,
    });
    if (!expense)
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    return expense;
  }

  async deleteExpenseById(expenseId: string, userId: string) {
    const expense = await this.expenseModel.findOneAndDelete({
      _id: expenseId,
      owner: userId,
    });
    if (!expense)
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { expenses: expense._id },
    });

    return expense;
  }

  async updateExpenseById(
    expenseId: string,
    userId: string,
    dto: UpdateExpenseDto,
  ) {
    const expense = await this.expenseModel.findOne({
      _id: expenseId,
      owner: userId,
    });
    if (!expense)
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);

    const updatedExpense = await this.expenseModel.findOneAndUpdate(
      { _id: expenseId, owner: userId },
      {
        $set: {
          ...dto,
          totalPrice:
            (dto.quantity ?? expense.quantity) * (dto.price ?? expense.price),
        },
      },
      { new: true },
    );

    if (!updatedExpense)
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    return updatedExpense;
  }
}
