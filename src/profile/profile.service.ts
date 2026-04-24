import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly i18n: I18nService,
    private readonly prisma: PrismaService,
  ) {}
  async getUserProfile(username: string) {
    try {
      if (!username) {
        return new UnprocessableEntityException(this.i18n.t('users.username_required'));
      }

      const user = await this.prisma.user.findFirst({ where: { username } });
      
      if(!user) {
        throw new BadRequestException(this.i18n.t('users.user_not_found'));
      }

      return { profile: user || {} };
    } catch (error) {
      throw error;
    }
  }
}
