import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWTStragety } from "./jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      secret: config.get('JWT_ACCESS_TOKEN_SECRET') || '',
      signOptions: { expiresIn: '15h' },
    }),
  })],
  controllers: [AuthController],
  providers: [AuthService, JWTStragety],
  exports: [AuthService],
})
export class AuthModule {}