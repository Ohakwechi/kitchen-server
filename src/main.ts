import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('1. Starting NestJS bootstrap...');
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const port = process.env.PORT || 3001;
    console.log(`2. Attempting to bind port ${port}...`);
    await app.listen(port, '0.0.0.0');
    console.log(`3. Buttns API live on port ${port}`);
  } catch (err) {
    console.error('FATAL BOOTSTRAP ERROR:', err);
    process.exit(1);
  }
}
bootstrap();