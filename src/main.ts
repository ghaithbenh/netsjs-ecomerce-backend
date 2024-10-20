import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'yourSecretKey', // Replace with your own secret key
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true in production with HTTPS
    }),
  );
  dotenv.config();

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors()
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();
