import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SpinUpService } from './config/infra/spinUp';

async function bootstrap() {
  const port = process.env.PORT || 3001;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  const spinUp = new SpinUpService();
  // 👇️ handle uncaught exceptions
  process.on('uncaughtException', function (err) {
    console.log(err);
  });

  await app.listen(port);
  console.log(`Application is running on: ${port}`);
  spinUp.onModuleInit();
}
bootstrap();
