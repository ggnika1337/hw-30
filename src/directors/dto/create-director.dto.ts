import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;
}
