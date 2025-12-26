import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Habilitar CORS
  app.enableCors();

  // Prefijo global para la API
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log('');
  console.log('🌱 ===============================================');
  console.log('🌱  Sistema UAS - Unidad de Acondicionamiento');
  console.log('🌱 ===============================================');
  console.log(`🚀 Servidor: http://localhost:${port}`);
  console.log(`📡 API: http://localhost:${port}/${apiPrefix}`);
  console.log(`🗄️  Base de datos: ${configService.get('DB_DATABASE')}`);
  console.log(`🌍 Entorno: ${configService.get('NODE_ENV')}`);
  console.log('🌱 ===============================================');
  console.log('');
}
bootstrap();
