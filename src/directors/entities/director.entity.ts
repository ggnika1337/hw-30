import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Director {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;
}
