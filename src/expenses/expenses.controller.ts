import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import { ExpenseQueries } from './dtos/expenseQuery.dto';
import { IsAuthGuard } from 'src/guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// @UseGuards(ThrottlerGuard)
// @Throttle({ default: { limit: 25, ttl: 60000 } })
@Controller('expenses')
@UseGuards(IsAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'Got all expenses Successfully' })
  @Get()
  getExpenses(
    @UserId() userId: string,
    @Query() PaginationDto: ExpenseQueries,
  ) {
    return this.expensesService.getExpenses(userId, PaginationDto);
  }

  @ApiOperation({ summary: 'Get top spenders from users' })
  @ApiResponse({
    status: 200,
    description: 'Got all top-spenders Successfully',
  })
  @Get('/top-spenders')
  getTopSpenders() {
    return this.expensesService.getTopSpenders();
  }

  @ApiOperation({ summary: 'Get statistics' })
  @ApiResponse({ status: 200, description: 'Got all statistics Successfully' })
  @Get('/statistic/:expenseCategory')
  getStatistics(
    @Param('expenseCategory') expenseCategory: string,
    @UserId() userId: string,
  ) {
    return this.expensesService.getStatistics(expenseCategory, userId);
  }

  @ApiOperation({ summary: 'Get specific expense' })
  @ApiResponse({
    status: 200,
    description: 'Got specific expense Successfully',
  })
  @Get(':id')
  getById(@Param('id') id: string, @UserId() userId: string) {
    return this.expensesService.getExpenseById(id, userId);
  }

  @ApiOperation({ summary: 'Create new expense' })
  @ApiResponse({ status: 201, description: 'New expense created successfully' })
  @Post()
  createExpense(
    @UserId() userId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.createExpense(userId, createExpenseDto);
  }

  @ApiOperation({ summary: 'Delete new expense' })
  @ApiResponse({ status: 201, description: 'New expense deleted successfully' })
  @Delete(':id')
  deleteById(@Param('id') id: string, @UserId() userId: string) {
    return this.expensesService.deleteExpenseById(id, userId);
  }

  @ApiOperation({ summary: 'Update new expense' })
  @ApiResponse({ status: 201, description: 'New expense updated successfully' })
  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpenseById(id, userId, updateExpenseDto);
  }
}
