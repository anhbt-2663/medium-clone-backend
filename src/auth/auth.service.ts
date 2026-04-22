import {
  BadRequestException,
  ConflictException,
  Injectable, UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        throw new UnauthorizedException(this.i18n.t('auth.invalid_credentials'));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(this.i18n.t('auth.invalid_credentials'));
      }

      const tokens = await this.getToken(user.id, user.username);
      return {
        message: this.i18n.t('auth.login_success'),
        access_token: tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: registerDto.username },
            { email: registerDto.email },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException(this.i18n.t('auth.username_or_email_taken'));
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          username: registerDto.username,
          password: hashedPassword,
        },
      });

      return { message: this.i18n.t('auth.register_success') };
    } catch (error) {
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { refreshToken },
      });

      if (!user) {
        throw new BadRequestException(this.i18n.t('auth.invalid_credentials'));
      }

      await this.prisma.user.updateMany({
        where: { refreshToken: refreshToken },
        data: { refreshToken: null },
      });
      return { message: this.i18n.t('auth.logout_success') };
    } catch (error){
      throw error;
    }
  }

  async refreshToken(
    id: number,
    refreshToken: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException(this.i18n.t('auth.invalid_refresh_token'));
      }

      const token = await this.signToken(id, user.username);

      await this.prisma.user.update({
        where: { id },
        data: { refreshToken: token.refresh_token },
      });

      return {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };
    } catch (error){
      throw error;
    }
  }

  private async getToken(id: number, username: string) {
    const tokens = await this.signToken(id, username);

    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: tokens.refresh_token },
    });
    return tokens;
  }

  private async signToken(
    id: number,
    username: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: id, username };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }
}
