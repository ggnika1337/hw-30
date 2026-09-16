import { IsBoolean, IsNumber, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  fullName!: string;

  @IsString()
  avatar!: string;

  @IsString()
  email!: string;

  @IsString()
  gender!: string;

  @IsBoolean()
  isVerified: boolean;

  @IsNumber()
  phoneNumber!: number;

  @IsNumber()
  age!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsNumber()
  totalSpent!: number;
}
