import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
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

  const mockUserService = {
    getCurrentUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      mockUserService.getCurrentUser.mockResolvedValue(mockUser);

      const result = await userController.getCurrentUser(1);

      expect(result).toEqual(mockUser);
      expect(mockUserService.getCurrentUser).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      const updatedUser = { ...mockUser, ...mockUpdateDto };
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await userController.updateUser(1, mockUpdateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, mockUpdateDto);
    });
  });
});
