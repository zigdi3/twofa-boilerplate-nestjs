/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiEnvService {

  bypassSecrets(key, value) {

    if (key === 'EMAIL_PASS'
      || key === 'JWT_SECRET'
      || key === 'DB_PASSWORD'
      || key === 'EMAIL_API'
      || key === 'DB_USERNAME'
      || key === 'DATA_URI'
    ) {
      return undefined;
    }
    else {
      return value;
    }
  }
}
