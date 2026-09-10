import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { DirectorsController } from './directors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import { Film } from 'src/films/entities/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Director, Film])],
  controllers: [DirectorsController],
  providers: [DirectorsService],
})
export class DirectorsModule {}
