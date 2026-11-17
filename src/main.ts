import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Listen on PORT assigned by Render, or 3000 locally
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();