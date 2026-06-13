import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Session-based auth using in-memory store (swap to connect-mongo for production)
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'fallback-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  // Page routes are excluded from the /api prefix so they remain at the root
  app.setGlobalPrefix('api', {
    exclude: ['/', '/feedback', '/admin', '/login', '/logout'],
  });

  // Strip unknown properties, reject non-whitelisted input, auto-transform payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
