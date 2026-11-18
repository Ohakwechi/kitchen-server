import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your Next.js frontend (localhost & Vercel) can connect
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Automatically validate DTOs (4-digit PIN, email, phone) & strip unknown fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Buttns API running on port ${port}`);
}
bootstrap();