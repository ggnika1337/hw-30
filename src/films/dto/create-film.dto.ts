import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  director: string;
}
