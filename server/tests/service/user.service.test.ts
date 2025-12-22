import { HttpStatus } from 'shared';
import { UserService, type IUserServiceProps } from '../../src/services/user.service.js';
import type { UserRepository } from '../../src/repositories/user.repository.js';
import { ApiError } from '../../src/utils/ApiError.js';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<UserRepository>;
  let mockDeps: jest.Mocked<IUserServiceProps>;

  beforeEach(() => {
    mockDeps = {
      repo: {} as jest.Mocked<UserRepository>,
      userMapper: { toDbUser: jest.fn(), toPublicUser: jest.fn() } as any,
      sendEmail: jest.fn() as any,
      generateOTP: jest.fn(),
      generateExpiryTime: jest.fn(),
      startSession: jest.fn(),
      profileModel: { create: jest.fn() } as any,
      jwt: { verify: jest.fn() } as any,
      slugifyFn: jest.fn() as any,
    };

    repo = {
      findById: jest.fn(),
      updateRefreshToken: jest.fn(),
      findByIdentifier: jest.fn(),
      findByEmailOrUsername: jest.fn(),
      updateVerificationStatus: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      saveWithValidation: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    Object.assign(mockDeps, { repo }); // inject updated repo mock
    service = new UserService(mockDeps);
  });

  describe('generateAccessAndRefreshToken', () => {
    it('should generate and persist tokens for a valid user', async () => {
      const mockedUser = {
        _id: 'user-id',
        generateAccessToken: jest.fn().mockReturnValue('access-token'),
        generateRefreshToken: jest.fn().mockReturnValue('refresh-token'),
      } as any;

      repo.findById.mockResolvedValue(mockedUser);
      repo.updateRefreshToken.mockResolvedValue({} as any);

      const result = await service.generateAccessAndRefreshToken('user-id');

      expect(repo.findById).toHaveBeenCalledWith('user-id');
      expect(mockedUser.generateAccessToken).toHaveBeenCalled();
      expect(mockedUser.generateRefreshToken).toHaveBeenCalled();
      expect(repo.updateRefreshToken).toHaveBeenCalledWith('user-id', 'refresh-token');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.generateAccessAndRefreshToken('missing-id')).rejects.toBeInstanceOf(
        ApiError,
      );

      await expect(service.generateAccessAndRefreshToken('missing-id')).rejects.toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('verifyOtp', () => {
    it('should verify otp and update user verification', async () => {
      const mockedUser = {
        _id: 'user-id',
        otp: '123',
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // remains this much of time to expiry
        isVerified: false,
      } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);
      repo.updateVerificationStatus.mockResolvedValue({} as any);

      const result = await service.verifyOtp({ otp: '123', identifier: 'user-id' });

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
      expect(repo.updateVerificationStatus).toHaveBeenCalledWith('user-id', true);

      expect(result).toEqual({ isValidOtp: true });
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      repo.findByIdentifier.mockResolvedValue(null);

      const promise = service.verifyOtp({ otp: '123', identifier: 'missing-id' });

      await expect(promise).rejects.toBeInstanceOf(ApiError);
      await expect(promise).rejects.toMatchObject({ statusCode: HttpStatus.NOT_FOUND });
    });

    it('should throw GONE if otp is expired', async () => {
      const mockedUser = {
        _id: 'user-id',
        otp: '123',
        otpExpiry: new Date(Date.now() - 5 * 60 * 1000),
        isVerified: true,
      } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);

      const promise = service.verifyOtp({ otp: '123', identifier: 'user-id' });
      await expect(promise).rejects.toBeInstanceOf(ApiError);
      await expect(promise).rejects.toMatchObject({ statusCode: HttpStatus.GONE });
    });

    it('should throw UNAUTHORIZED/INCORRECT if the otp is incorrect', async () => {
      const mockedUser = {
        _id: 'user-id',
        otp: '123',
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: true,
      } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);

      const promise = service.verifyOtp({ otp: '1234', identifier: 'user-id' });
      await expect(promise).rejects.toBeInstanceOf(ApiError);
      await expect(promise).rejects.toMatchObject({ statusCode: HttpStatus.UNAUTHORIZED });
    });
  });

  describe('resendOtp', () => {
    it('should find user, generate otp, send email and save in db', async () => {
      const mockedUser = {
        _id: 'user-id',
        email: 'one@example.com',
      } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);
      mockDeps.generateOTP.mockReturnValue('123456');
      mockDeps.generateExpiryTime.mockReturnValue(new Date());
      mockDeps.sendEmail.mockResolvedValue(true);
      repo.save.mockResolvedValue({} as any);

      await expect(service.resendOtp({ identifier: 'user-id' })).resolves.toBe(true);

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
      expect(mockDeps.generateOTP).toHaveBeenCalled();
      expect(mockDeps.generateExpiryTime).toHaveBeenCalled();
      expect(mockDeps.sendEmail).toHaveBeenCalledWith('one@example.com', '123456');
      expect(repo.save).toHaveBeenCalledWith(mockedUser);
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      repo.findByIdentifier.mockResolvedValue(null);

      await expect(service.resendOtp({ identifier: 'user-id' })).rejects.toBeInstanceOf(ApiError);

      await expect(service.resendOtp({ identifier: 'user-id' })).rejects.toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
      });

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
    });

    it('should throw INTERNAL_SERVER_ERROR if unable to send otp email', async () => {
      const mockedUser = {
        _id: 'user-id',
        email: 'one@example.com',
      } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);
      mockDeps.generateOTP.mockReturnValue('123456');
      mockDeps.generateExpiryTime.mockReturnValue(new Date());
      mockDeps.sendEmail.mockResolvedValue(false);

      await expect(service.resendOtp({ identifier: 'user-id' })).rejects.toBeInstanceOf(ApiError);

      await expect(service.resendOtp({ identifier: 'user-id' })).rejects.toMatchObject({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
      expect(mockDeps.generateOTP).toHaveBeenCalled();
      expect(mockDeps.generateExpiryTime).toHaveBeenCalled();
      expect(mockDeps.sendEmail).toHaveBeenCalledWith('one@example.com', '123456');
      expect(repo.save).not.toHaveBeenCalled();
    });
  });
});
