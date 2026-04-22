import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'authentication error' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Username already taken' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Put('logout')
  logout(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;
    return this.authService.logout(refreshToken);
  }

  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh-token')
  refresh(@Body() body: { userId: number; refreshToken: string }) {
    const { userId, refreshToken } = body;
    return this.authService.refreshToken(userId, refreshToken);
  }
}
