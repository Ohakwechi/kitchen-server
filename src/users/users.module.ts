import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'buttns_super_secret_estate_key_2026',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}