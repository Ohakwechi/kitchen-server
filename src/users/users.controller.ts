import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CREATE: Onboard new resident
  @Post('onboard')
  async onboard(@Body() dto: OnboardUserDto) {
    return this.usersService.onboardResident(dto);
  }

  // READ (Self): Get current logged-in resident profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return this.usersService.getProfileById(req.user.userId);
  }

  // READ ALL (Admin only): Get all registered users
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  // UPDATE (Self): Update own name or estate location
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req: any,
    @Body() body: { name?: string; location?: string },
  ) {
    return this.usersService.updateUser(req.user.userId, body);
  }

  // DELETE (Admin only): Delete a user by ID
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('magic/:token')
  async verifyMagicLink(@Param('token') token: string) {
    return this.usersService.loginWithMagicToken(token);
  }
}