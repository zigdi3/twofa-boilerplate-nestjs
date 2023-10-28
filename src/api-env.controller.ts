/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { ApiEnvService } from './api-env.service';

@Controller()
export class ApiEnvController {
  /**
   *
   */
  constructor(private _apiEnvService: ApiEnvService) {

  }

  @Get('/env-variables')
  async getEnvVariables() {
    return await JSON.stringify(process.env, this._apiEnvService.bypassSecrets);
  }
}
