import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let profileController: ProfileController;
  let profileService: ProfileService;

  const mockProfile = {
    profile: {
      id: 1,
      email: 'bui.the.anh@sun-asterisk.com',
      username: 'buitheanh',
      bio: 'Hello world',
      image: 'https://example.com/avatar.png',
    },
  };

  const mockProfileService = {
    getUserProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(profileController).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('should return the user profile by username', async () => {
      mockProfileService.getUserProfile.mockResolvedValue(mockProfile);

      const result = await profileController.getUserProfile('buitheanh');

      expect(result).toEqual(mockProfile);
      expect(mockProfileService.getUserProfile).toHaveBeenCalledWith(
        'buitheanh',
      );
    });
  });
});
