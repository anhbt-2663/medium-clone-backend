import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  };
  const mockLoginDto = {
    username: 'buitheanh',
    password: 'Aa@123456',
  };

  const mockRegisterDto = {
    email: 'bui.the.anh@sun-asterisk.com',
    username: 'buitheanh',
    password: 'Aa@123456',
  };

  const mockTokens = {
    access_token: 'mockAccessToken',
    refresh_token: 'mockRefreshToken',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return access and refresh tokens on successful login', async () => {
      mockAuthService.login.mockResolvedValue(mockTokens);
      const result = await authController.login(mockLoginDto);
      expect(result).toEqual(mockTokens);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });

  describe('register', () => {
    it('should return success message on successful registration', async () => {
      const mockResponse = { message: 'Registration successful' };
      mockAuthService.register.mockResolvedValue(mockResponse);
      const result = await authController.register(mockRegisterDto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRegisterDto);
    });
  });

  describe('logout', () => {
    it('should return success message on successful logout', async () => {
      const mockResponse = { message: 'Logout successful' };
      mockAuthService.logout.mockResolvedValue(mockResponse);
      const result = await authController.logout({
        refreshToken: 'mockRefreshToken',
      });
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith('mockRefreshToken');
    });
  });

  describe('refresh', () => {
    it('should return new access and refresh tokens on successful token refresh', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockTokens);
      const result = await authController.refresh({
        userId: 1,
        refreshToken: 'mockRefreshToken',
      });
      expect(result).toEqual(mockTokens);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        1,
        'mockRefreshToken',
      );
    });
  });
});
