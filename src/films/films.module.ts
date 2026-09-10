import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film } from './entities/film.entity';
import { Director } from 'src/directors/entities/director.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Director])],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
