import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentUser(id: number) {
    try {
      const currentUser = await this.prisma.user.findUnique({ where: { id } });

      if(!currentUser) {
        throw new BadRequestException(this.i18n.t('users.user_not_found'));
      }

      return currentUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, user: UserDto) {
      try {
        const currentUser = await this.prisma.user.findUnique({ where: { id } });
  
        if(!currentUser) {
          throw new BadRequestException(this.i18n.t('users.user_not_found'));
        }

        const updatedUser = await this.prisma.user.update({where: { id }, data: user });

        return updatedUser;
      } catch (error) {
        throw error;
      }
    

  }
}
