import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Director } from 'src/directors/entities/director.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmRepo: Repository<Film>,

    @InjectRepository(Director)
    private directorRepo: Repository<Director>,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    const existFilm = await this.filmRepo.findOneBy({
      name: createFilmDto.name,
    });

    const existsDirector = await this.directorRepo.findOneBy({
      id: createFilmDto.director,
    });

    if (!existsDirector) {
      throw new BadRequestException('Director not found.');
    }

    if (existFilm) {
      throw new BadRequestException('Film exists.');
    }

    const newFilm = this.filmRepo.create(createFilmDto);
    return await this.filmRepo.save(newFilm);
  }

  async findAll(
    page = 1,
    limit = 30,
    genre?: string,
    yearFrom?: number,
    yearTo?: number,
    name?: string,
  ) {
    const query = this.filmRepo.createQueryBuilder('film');

    if (genre) {
      query.andWhere('film.genre = :genre', { genre });
    }

    if (yearFrom) {
      query.andWhere('film.year >= :yearFrom', { yearFrom });
    }

    if (yearTo) {
      query.andWhere('film.year <= :yearTo', { yearTo });
    }

    if (name) {
      query.andWhere('film.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const skip = (page - 1) * limit;
    return query.skip(skip).take(limit).getMany();
  }

  findOne(id: string) {
    return this.filmRepo.findOneBy({
      id: id,
    });
  }

  async update(id: string, updateFilmDto: UpdateFilmDto) {
    const existFilm = await this.filmRepo.findOneBy({
      id,
    });

    const duplicateName = await this.filmRepo.findOneBy({
      name: updateFilmDto.name,
    });

    if (!existFilm) {
      throw new BadRequestException('Film not found.');
    }

    if (duplicateName && duplicateName.id !== id) {
      throw new BadRequestException('Film name in use.');
    }

    const updatedFilm = this.filmRepo.update(id, updateFilmDto);
    return { ...existFilm, ...updatedFilm };
  }

  async remove(id: string) {
    const existFilm = await this.filmRepo.findOneBy({
      id,
    });
    if (!existFilm) {
      throw new BadRequestException('Film not found.');
    }
    await this.filmRepo.delete({ id });
    return existFilm;
  }
}
