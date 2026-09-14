import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQuery } from './dtos/userQuery.dto';
import { IsAuthGuard } from 'src/guards/isAuth.guard';
import { UserId } from './decorators/user.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// @UseGuards(ThrottlerGuard)
// @Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Extend subscription of a user' })
  @ApiResponse({ status: 201, description: 'Subscription extended' })
  @Patch('upgrade-subscription')
  @UseGuards(IsAuthGuard)
  upgradeSubscription(@UserId() userId: string) {
    return this.usersService.upgradeSubscription(userId);
  }

  @ApiOperation({ summary: 'Change PFP of a user' })
  @ApiResponse({ status: 201, description: 'PFP updated successfully' })
  @Post(':id/change-avatar')
  @UseGuards(IsAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  changeAvatar(
    @UserId() requesterId: string,
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.changeAvatar(userId, requesterId, file);
  }

  @ApiOperation({ summary: 'Remove PFP of a user' })
  @ApiResponse({ status: 201, description: 'PFP removed successfully' })
  @Post(':id/remove-avatar')
  @UseGuards(IsAuthGuard)
  removeAvatar(@UserId() requesterId: string, @Param('id') userId: string) {
    return this.usersService.removeAvatar(userId, requesterId);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Got all users' })
  @Get()
  getUsers(@Query() PaginationDto: UserQuery) {
    return this.usersService.getUsers(PaginationDto);
  }

  @ApiOperation({ summary: 'Sort all users by gender' })
  @ApiResponse({ status: 200, description: 'Sorted all users by gender' })
  @Get('/sortByGender')
  sortByGender() {
    return this.usersService.sortedByGender();
  }

  @ApiOperation({ summary: 'Get specific user' })
  @ApiResponse({ status: 200, description: 'Got user' })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Delete specific user' })
  @ApiResponse({ status: 200, description: 'Deleted specific user' })
  @Delete(':id')
  @UseGuards(IsAuthGuard)
  deleteById(@Param('id') id: string, @UserId() userId: string) {
    return this.usersService.deleteUserById(id, userId);
  }

  @ApiOperation({ summary: 'Update specific user' })
  @ApiResponse({ status: 200, description: 'Updated specific user' })
  @Patch(':id')
  @UseGuards(IsAuthGuard)
  updateById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserId() userId: string,
  ) {
    return this.usersService.updateUserById(id, userId, updateUserDto);
  }
}
