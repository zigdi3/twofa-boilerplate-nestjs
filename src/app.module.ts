import { ApiEnvService } from './api-env.service';
import { ApiEnvController } from './api-env.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ormConfig } from './db/ormconfig';
import { User } from './entity/app.entity';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig()),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" ${process.env.EMAIL_ROOT}',
      },
      template: {
        dir: join(__dirname, "../views/email-templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

  ],
  controllers: [
    ApiEnvController,
    AppController
  ],
  providers: [
    ApiEnvService,
    AppService
  ],
})
export class AppModule { }
