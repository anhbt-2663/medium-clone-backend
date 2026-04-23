import { Module, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStragety } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const jwtAccessTokenSecret = config.get<string>(
          'JWT_ACCESS_TOKEN_SECRET',
        );
        if (!jwtAccessTokenSecret) {
          throw new UnauthorizedException('JWT_ACCESS_TOKEN_SECRET is required');
        }
        return {
          secret: jwtAccessTokenSecret,
          signOptions: { expiresIn: '15m' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStragety],
  exports: [AuthService],
})
export class AuthModule {}
