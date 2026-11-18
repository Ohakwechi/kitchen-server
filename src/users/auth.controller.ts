import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/onboard-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('quick-login')
  async login(@Body() dto: LoginUserDto) {
    return this.usersService.loginWithPin(dto);
  }
}