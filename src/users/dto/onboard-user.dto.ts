import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OnboardUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  location?: string;
}

export class QuickLoginDto {
  @IsString()
  @IsNotEmpty()
  identifier!: string; // Accepts either WhatsApp phone or email
}