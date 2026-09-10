import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  genre: string;

  @Column()
  year: number;

  // @OneToMany()
  @Column()
  director: string;
}
