import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApiEnvController } from './api-env.controller';
import { ApiEnvService } from './api-env.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './db/ormconfig';
import { User } from './entity/app.entity';

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
        service: 'SendGrid',
        secure: false,
        auth: {
          user: process.env.APIKey,
        },
      },
      defaults: {
        from: '"No Reply" ${process.env.EMAIL_ROOT}',
      },
      template: {
        dir: join(__dirname, '../views/email-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [ApiEnvController, AppController],
  providers: [ApiEnvService, AppService],
})
export class AppModule {}
