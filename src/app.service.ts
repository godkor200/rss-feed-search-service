import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return {
      message: 'RSS / Feed Search MVP API is running',
      health: 'ok',
    };
  }

  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
