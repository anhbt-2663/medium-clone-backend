import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserDto {
  @ApiProperty({ example: 'bui.the.anh@gmail.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.is_email') })
  @IsString({ message: i18nValidationMessage('validation.is_string') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.is_not_empty') })
  email: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  image: string;
}
