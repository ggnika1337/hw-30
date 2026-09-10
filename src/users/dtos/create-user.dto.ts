import { IsBoolean, IsNumber, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  fullName!: string;

  @IsString()
  email!: string;

  @IsString()
  gender!: string;

  @IsNumber()
  phoneNumber!: number;

  @IsNumber()
  age!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsNumber()
  totalSpent!: number;
}
