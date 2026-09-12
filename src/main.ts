import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// თქვენი დავალება შემდეგია:

// 3) პროდუქტებზე იუზერს უნდა შეეძლოს როგორც ერთის ისე რამდენიმე ფოტოს ატვირთვა
// 4) უნდა შეგეძლოთ ფოტოების წაშლა
// 5) დააკონფიგურირეთ cloudfront

// უნდა გამოიყენოთ AWS-S3 bucket
