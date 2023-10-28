import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/signup')
  async Signup(@Body() user: User) {
    return await this.appService.signup(user);
  }

  @Get()
  @Render('index')
  root() { }

  @Get('/verify')
  @Render('verify')
  VerifyEmail() { }

  async Verify(@Body() body) {
    return await this.appService.verifyAccount(body.code)
  }
}
