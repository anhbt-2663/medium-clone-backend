import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTStragety extends PassportStrategy(
  Strategy,
  'medium-clone-jwt',
) {
  constructor(configService: ConfigService) {
    const jwtAccessTokenSecret = configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    if (!jwtAccessTokenSecret) {
      throw new Error('JWT_ACCESS_TOKEN_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtAccessTokenSecret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub };
  }
}
