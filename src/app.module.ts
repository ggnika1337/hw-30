import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmsModule } from './films/films.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorsModule } from './directors/directors.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.SQL_HOST,
      port: Number(process.env.SQL_PORT),
      username: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DATABASE,
      autoLoadEntities: true,
      synchronize: Boolean(process.env.SQL_SYNC),
    }),
    FilmsModule,
    DirectorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
