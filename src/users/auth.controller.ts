// src/users/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { QuickLoginDto } from './dto/onboard-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('quick-login')
  async quickLogin(@Body() dto: QuickLoginDto) {
    return this.usersService.quickLogin(dto.identifier);
  }
}