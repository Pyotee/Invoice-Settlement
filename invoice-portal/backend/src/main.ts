import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.APP_PORT || 4000;
  await app.listen(port as number);
  console.log(`Backend running on :${port}`);
}
bootstrap();
