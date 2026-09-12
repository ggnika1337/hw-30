import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from 'src/users/users.module';
import { isEmailProvided } from 'src/guards/is-email-provided.guard';
import { AuthModule } from '../auth/auth.module';
import { AwsS3Module } from '../aws-s3/aws-s3.module';

@Module({
  imports: [UsersModule, AuthModule, AwsS3Module],
  controllers: [ProductsController],
  providers: [ProductsService, isEmailProvided],
})
export class ProductsModule {}
