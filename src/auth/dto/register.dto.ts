import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterDto {
  @ApiProperty({ example: 'bui.the.anh@gmail.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Username must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(6, { message: 'Username must be at least 6 characters long' })
  username: string;
}
