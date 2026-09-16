import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
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

  @IsString()
  OTPCode: string;

  @IsDate()
  OTPCodeExpirationDate: number;

  @IsNumber()
  phoneNumber!: number;

  @IsNumber()
  age!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsNumber()
  totalSpent!: number;
}
