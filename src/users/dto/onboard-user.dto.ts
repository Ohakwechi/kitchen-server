import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class OnboardUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'WhatsApp phone number is required' })
  phone!: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin!: string;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number or email is required' })
  identifier!: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'Enter your 4-digit PIN' })
  pin!: string;
}