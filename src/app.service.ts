import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './entity/app.entity';

@Injectable()
export class AppService {
  private code;

  constructor(@InjectRepository(User) private userRepository: Repository<User>, private mailerService: MailerService) {
    this.code = Math.floor(10000 + Math.random() * 90000).toString() as unknown as string;
  }

  async sendConfirmedEmail(user: User) {
    const { email, fullName } = user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to 2FA App! Email Confirmed',
      template: 'confirmed',
      context: {
        fullName,
        email
      },
    });
  }

  async sendConfirmationEmail(user: any) {
    const { email, fullname } = await user
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to 2FA App! Confirm Email',
      template: 'confirm',
      context: {
        fullname,
        code: this.code
      },
    });
  }

  async signup(user: User): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      const reqBody = {
        fullname: user.fullName,
        email: user.email,
        password: hash,
        authConfirmToken: "",
      }
      const newUser = this.userRepository.insert(reqBody);
      await this.sendConfirmationEmail(reqBody);
      return true
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signin(user: User, jwt: JwtService): Promise<any> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          email: user.email
        }
      });
      if (foundUser) {
        if (foundUser.isVerified) {
          if (await bcrypt.compare(user.password, foundUser.password)) {
            const payload = { email: user.email };
            return {
              token: jwt.sign(payload),
            };
          }
        } else {
          return new HttpException('Please verify your account', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
      }
      return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyAccount(code: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          authConfirmToken: code
        }
      });
      if (!user) {
        return new HttpException('Verification code has expired or not found', HttpStatus.UNAUTHORIZED)
      }
      await this.userRepository.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined })
      await this.sendConfirmedEmail(user)
      return true
    } catch (e) {
      return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}