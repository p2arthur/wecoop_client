import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const apiPort = 3000;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(apiPort, () => console.log(`Listening on port: ${apiPort}`));
}
bootstrap();
