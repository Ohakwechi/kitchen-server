import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { status: 'ok', service: 'Buttns API' };
  }

  @Get('health')
  healthCheck() {
    return { status: 'awake', timestamp: new Date().toISOString() };
  }
}