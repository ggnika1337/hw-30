import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Auth/Products/Expenses Api')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// თქვენი დავალებაა წინა 31 დავალებას დაუმატოთ შემდეიგ ფუნცქიონალი

// 1) დააიმპლემენტირეთ nodemailer ისევე როგორც ლექციაზე ვქენით
// 2) ავტორიზაციის ფლოუს დაუმატეთ OTP code ფიჩერი.
// 3) როცა იუზერი წარმატებით გაივლის ვერიფიკაციას გაუგზავნეთ მას Welcome იმეილი
// 4) როცა იუზერი წაშლის თავის თავს ანუ deactivate გაუკეთებს ექაუნთს მაგ დროსაც გააგზავნეთ email ზე შეტყობინება
