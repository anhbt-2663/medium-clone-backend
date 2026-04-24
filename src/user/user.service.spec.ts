import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

describe('UserService', () => {
  let userService: UserService;

  const mockUser = {
    id: 1,
    email: 'bui.the.anh@sun-asterisk.com',
    username: 'buitheanh',
    bio: 'Hello world',
    image: 'https://example.com/avatar.png',
  };

  const mockUpdateDto = {
    email: 'bui.the.anh@sun-asterisk.com',
    bio: 'Updated bio',
    image: 'https://example.com/new-avatar.png',
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockI18nService = {
    t: jest.fn().mockReturnValue('User not found'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return the user when found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getCurrentUser(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(userService.getCurrentUser(999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      const updatedUser = { ...mockUser, ...mockUpdateDto };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, mockUpdateDto);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateDto,
      });
    });

    it('should throw BadRequestException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(userService.updateUser(999, mockUpdateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
