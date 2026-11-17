import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { OnboardUserDto } from './dto/onboard-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboard')
  async onboard(@Body() dto: OnboardUserDto) {
    console.log('Incoming onboard payload:', dto); // <-- Check your terminal logs when you click submit!
    return this.usersService.onboardResident(dto);
  }

  @Get('magic/:token')
  async verifyMagicLink(@Param('token') token: string) {
    return this.usersService.loginWithMagicToken(token);
  }
}