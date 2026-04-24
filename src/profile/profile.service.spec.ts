import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

describe('ProfileService', () => {
  let profileService: ProfileService;

  const mockUser = {
    id: 1,
    email: 'bui.the.anh@sun-asterisk.com',
    username: 'buitheanh',
    bio: 'Hello world',
    image: 'https://example.com/avatar.png',
  };

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
    },
  };

  const mockI18nService = {
    t: jest.fn().mockReturnValue('User not found'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('should return the user profile when user exists', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await profileService.getUserProfile('buitheanh');

      expect(result).toEqual({ profile: mockUser });
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { username: 'buitheanh' },
      });
    });

    it('should throw BadRequestException when user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        profileService.getUserProfile('nonexistent'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
