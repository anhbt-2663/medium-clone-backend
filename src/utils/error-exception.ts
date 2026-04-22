import { ConflictException, InternalServerErrorException, BadRequestException, UnauthorizedException  } from '@nestjs/common';

export const handleError = (error: {code: number | string, message: string | string[]}) => {
  switch (error.code) {
    case 'P2002':
      throw new ConflictException(error.message);
    case 'P2025':
      throw new BadRequestException(error.message);
    case 401:
      throw new UnauthorizedException(error.message);
    default:
      throw error;
  }
};