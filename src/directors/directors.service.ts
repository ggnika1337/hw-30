import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Director } from './entities/director.entity';
import { Film } from 'src/films/entities/film.entity';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private directorRepo: Repository<Director>,

    @InjectRepository(Film)
    private filmRepo: Repository<Film>,
  ) {}

  create(dto: CreateDirectorDto) {
    const director = this.directorRepo.create(dto);
    return this.directorRepo.save(director);
  }

  findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return this.directorRepo.find({
      skip,
      take: limit,
    });
  }

  findOne(id: string) {
    return this.directorRepo.findOneBy({ id: id });
  }

  async update(id: string, updateDirectorDto: UpdateDirectorDto) {
    const existDirector = await this.directorRepo.findOneBy({ id });

    if (!existDirector) {
      throw new BadRequestException('Director not found.');
    }

    await this.directorRepo.update(id, updateDirectorDto);

    return this.directorRepo.findOneBy({ id });
  }

  async remove(id: string) {
    const existDirector = await this.directorRepo.findOneBy({ id });

    if (!existDirector) {
      throw new BadRequestException('Director not found.');
    }

    await this.filmRepo.delete({
      director: id,
    });

    await this.directorRepo.delete({ id });

    return existDirector;
  }
}
