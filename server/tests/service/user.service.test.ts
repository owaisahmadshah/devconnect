import { HttpStatus, type TAuthUserServer } from 'shared';

import { UserService, type IUserServiceProps } from '../../src/services/user.service.js';

import type { UserRepository } from '../../src/repositories/user.repository.js';

import { ApiError } from '../../src/utils/ApiError.js';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<UserRepository>;
  let mockDeps: jest.Mocked<IUserServiceProps>;

  const expectApiError = async (promise: Promise<any>, statusCode: number) => {
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ statusCode });
  };

  const createMockedSession = () => ({
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  });

  const mockUsers = {
    basic: {
      _id: 'user-id',
      email: 'one@example.com',
      username: 'github',
      firstName: 'Git',
      lastName: 'Hub',
      password: '1234567890',
      role: 'developer' as const,
    },
    withTokens: {
      _id: 'user-id',
      generateAccessToken: jest.fn().mockReturnValue('access-token'),
      generateRefreshToken: jest.fn().mockReturnValue('refresh-token'),
    },
    withOtp: {
      _id: 'user-id',
      otp: '123',
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    },
    withAuth: {
      _id: 'user-id',
      email: 'one@example.com',
      password: '1234',
      isVerified: true,
      isPasswordCorrect: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    },
  };

  beforeEach(() => {
    mockDeps = {
      repo: {} as jest.Mocked<UserRepository>,
      userMapper: { toDbUser: jest.fn(), toPublicUser: jest.fn() },
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

    Object.assign(mockDeps, { repo });
    service = new UserService(mockDeps);
  });

  describe('generateAccessAndRefreshToken', () => {
    it('should generate and persist tokens for a valid user', async () => {
      const mockedUser = mockUsers.withTokens as any;

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

      await expectApiError(
        service.generateAccessAndRefreshToken('missing-id'),
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('verifyOtp', () => {
    it('should verify otp and update user verification', async () => {
      const mockedUser = mockUsers.withOtp as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);
      repo.updateVerificationStatus.mockResolvedValue({} as any);

      const result = await service.verifyOtp({ otp: '123', identifier: 'user-id' });

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
      expect(repo.updateVerificationStatus).toHaveBeenCalledWith('user-id', true);
      expect(result).toEqual({ isValidOtp: true });
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      repo.findByIdentifier.mockResolvedValue(null);

      await expectApiError(
        service.verifyOtp({ otp: '123', identifier: 'missing-id' }),
        HttpStatus.NOT_FOUND,
      );
    });

    it('should throw GONE if otp is expired', async () => {
      const mockedUser = {
        ...mockUsers.withOtp,
        otpExpiry: new Date(Date.now() - 5 * 60 * 1000),
        isVerified: true,
      } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);

      await expectApiError(
        service.verifyOtp({ otp: '123', identifier: 'user-id' }),
        HttpStatus.GONE,
      );
    });

    it('should throw UNAUTHORIZED if the otp is incorrect', async () => {
      const mockedUser = { ...mockUsers.withOtp, isVerified: true } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);

      await expectApiError(
        service.verifyOtp({ otp: '1234', identifier: 'user-id' }),
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('resendOtp', () => {
    const setupOtpMocks = () => {
      mockDeps.generateOTP.mockReturnValue('123456');
      mockDeps.generateExpiryTime.mockReturnValue(new Date());
    };

    it('should find user, generate otp, send email and save in db', async () => {
      const mockedUser = { _id: 'user-id', email: 'one@example.com' } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);
      setupOtpMocks();
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

      await expectApiError(service.resendOtp({ identifier: 'user-id' }), HttpStatus.NOT_FOUND);

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
    });

    it('should throw INTERNAL_SERVER_ERROR if unable to send otp email', async () => {
      const mockedUser = { _id: 'user-id', email: 'one@example.com' } as any;

      repo.findByIdentifier.mockResolvedValue(mockedUser);
      setupOtpMocks();
      mockDeps.sendEmail.mockResolvedValue(false);

      await expectApiError(
        service.resendOtp({ identifier: 'user-id' }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      expect(repo.findByIdentifier).toHaveBeenCalledWith('user-id');
      expect(mockDeps.generateOTP).toHaveBeenCalled();
      expect(mockDeps.generateExpiryTime).toHaveBeenCalled();
      expect(mockDeps.sendEmail).toHaveBeenCalledWith('one@example.com', '123456');
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    const mockedUser: TAuthUserServer = mockUsers.basic;

    const mockedDbUser = {
      _id: 'user-id',
      email: 'one@example.com',
      username: 'github',
      firstName: 'Git',
      lastName: 'Hub',
      otp: '123456',
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      role: 'developer',
      refreshToken: '',
      password: '1234567890',
    };

    const setupCreateUserMocks = (session = createMockedSession()) => {
      repo.findByEmailOrUsername.mockResolvedValue(null);
      mockDeps.generateOTP.mockReturnValue(mockedDbUser.otp);
      mockDeps.generateExpiryTime.mockReturnValue(mockedDbUser.otpExpiry);
      mockDeps.sendEmail.mockResolvedValue(true);
      (mockDeps.userMapper.toDbUser as jest.Mock).mockReturnValue(mockedDbUser);
      mockDeps.startSession.mockResolvedValue(session as any);
      (mockDeps.slugifyFn as any).mockReturnValue('git-hub');
      return session;
    };

    it('creates a user and profile within a transaction when data is valid', async () => {
      const mockedSession = setupCreateUserMocks();
      repo.create.mockResolvedValue([{ ...mockedDbUser, user: 'user-id' }] as any);
      (mockDeps.profileModel.create as jest.Mock).mockResolvedValue([{ _id: 'profile-id' }] as any);

      await service.createUser(mockedUser);

      expect(repo.findByEmailOrUsername).toHaveBeenCalledWith(
        mockedUser.email,
        mockedUser.username,
      );
      expect(mockDeps.generateOTP).toHaveBeenCalled();
      expect(mockDeps.generateExpiryTime).toHaveBeenCalled();
      expect(mockDeps.sendEmail).toHaveBeenCalledWith(mockedUser.email, mockedDbUser.otp);
      expect(mockDeps.userMapper.toDbUser).toHaveBeenCalledWith(
        mockedUser,
        mockedDbUser.otp,
        mockedDbUser.otpExpiry,
      );
      expect(mockDeps.startSession).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalledWith(mockedDbUser, mockedSession);
      expect(mockDeps.profileModel.create).toHaveBeenCalled();
      expect(mockedSession.startTransaction).toHaveBeenCalled();
      expect(mockedSession.commitTransaction).toHaveBeenCalled();
      expect(mockedSession.endSession).toHaveBeenCalled();
    });

    it('should throw CONFLICT if user exists', async () => {
      repo.findByEmailOrUsername.mockResolvedValue(mockedDbUser as any);

      await expectApiError(service.createUser(mockedUser), HttpStatus.CONFLICT);

      expect(repo.findByEmailOrUsername).toHaveBeenCalledWith(
        mockedUser.email,
        mockedUser.username,
      );
    });

    it('should throw INTERNAL_SERVER_ERROR if unable to send email', async () => {
      repo.findByEmailOrUsername.mockResolvedValue(null);
      mockDeps.generateOTP.mockReturnValue(mockedDbUser.otp);
      mockDeps.generateExpiryTime.mockReturnValue(mockedDbUser.otpExpiry);
      mockDeps.sendEmail.mockResolvedValue(false);

      await expectApiError(service.createUser(mockedUser), HttpStatus.INTERNAL_SERVER_ERROR);

      expect(repo.findByEmailOrUsername).toHaveBeenCalledWith(
        mockedUser.email,
        mockedUser.username,
      );
      expect(mockDeps.generateOTP).toHaveBeenCalled();
      expect(mockDeps.generateExpiryTime).toHaveBeenCalled();
      expect(mockDeps.sendEmail).toHaveBeenCalled();
    });

    it('should throw INTERNAL_SERVER_ERROR if unable to create user', async () => {
      const mockedSession = setupCreateUserMocks();
      repo.create.mockResolvedValue([null] as any);

      await expectApiError(service.createUser(mockedUser), HttpStatus.INTERNAL_SERVER_ERROR);

      expect(repo.findByEmailOrUsername).toHaveBeenCalledWith(
        mockedUser.email,
        mockedUser.username,
      );
      expect(mockDeps.generateOTP).toHaveBeenCalled();
      expect(mockDeps.generateExpiryTime).toHaveBeenCalled();
      expect(mockDeps.userMapper.toDbUser).toHaveBeenCalledWith(
        mockedUser,
        mockedDbUser.otp,
        mockedDbUser.otpExpiry,
      );
      expect(repo.create).toHaveBeenCalledWith(mockedDbUser, mockedSession);
      expect(mockedSession.startTransaction).toHaveBeenCalled();
      expect(mockedSession.endSession).toHaveBeenCalled();
    });

    it('should abort transaction if profile creation fails with non-duplicate error', async () => {
      const mockedSession = setupCreateUserMocks();
      repo.create.mockResolvedValue([{ ...mockedDbUser, _id: 'user-id' }] as any);

      const error = new Error('DB failure');
      (mockDeps.profileModel.create as jest.Mock).mockRejectedValue(error);

      await expect(service.createUser(mockedUser)).rejects.toBeInstanceOf(ApiError);

      expect(mockedSession.abortTransaction).toHaveBeenCalled();
      expect(mockedSession.commitTransaction).not.toHaveBeenCalled();
      expect(mockedSession.endSession).toHaveBeenCalled();
    });
  });

  describe('signInUser', () => {
    const mockedUser = mockUsers.withAuth;

    const setupSignInMocks = () => {
      repo.findByIdentifier.mockResolvedValue(mockedUser as any);
      repo.findById.mockResolvedValue(mockedUser as any);
      repo.updateRefreshToken.mockResolvedValue({} as any);
      mockedUser.isPasswordCorrect.mockResolvedValue(true);
      mockedUser.generateAccessToken.mockReturnValue('access-token');
      mockedUser.generateRefreshToken.mockReturnValue('refresh-token');
    };

    it('checks if a user is verified and password is correct, then sign in user', async () => {
      setupSignInMocks();

      const result = await service.signInUser({
        identifier: mockedUser.email,
        password: mockedUser.password,
      });

      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
      expect(mockedUser.isPasswordCorrect).toHaveBeenCalledWith(mockedUser.password);
      expect(repo.findById).toHaveBeenCalledWith('user-id');
      expect(mockedUser.generateAccessToken).toHaveBeenCalled();
      expect(mockedUser.generateRefreshToken).toHaveBeenCalled();
      expect(repo.updateRefreshToken).toHaveBeenCalledWith('user-id', 'refresh-token');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw NOT_FOUND if user does not exit', async () => {
      repo.findByIdentifier.mockResolvedValue(null);

      await expectApiError(
        service.signInUser({
          identifier: mockedUser.email,
          password: mockedUser.password,
        }),
        HttpStatus.NOT_FOUND,
      );
    });

    it('should throw INTERNAL_SERVER_ERROR if user is not verified and unable to send otp', async () => {
      const unverifiedUser = {
        _id: 'user-id',
        email: 'one@example.com',
        password: '1234',
        isVerified: false,
        isPasswordCorrect: jest.fn(),
      };

      repo.findByIdentifier.mockResolvedValue(unverifiedUser as any);
      mockDeps.generateOTP.mockReturnValue('123456');
      mockDeps.generateExpiryTime.mockReturnValue(new Date());
      mockDeps.sendEmail.mockResolvedValue(false);

      await expectApiError(
        service.signInUser({
          identifier: unverifiedUser.email,
          password: unverifiedUser.password,
        }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      expect(repo.findByIdentifier).toHaveBeenCalledWith(unverifiedUser.email);
      expect(mockDeps.sendEmail).toHaveBeenCalled();
    });

    it('should throw FORBIDDEN if user is not verified', async () => {
      repo.findByIdentifier.mockResolvedValue({ ...mockedUser, isVerified: false } as any);
      const resendSpy = jest.spyOn(service, 'resendOtp').mockResolvedValue(true);

      await expectApiError(
        service.signInUser({
          identifier: mockedUser.email,
          password: mockedUser.password,
        }),
        HttpStatus.FORBIDDEN,
      );

      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
      expect(resendSpy).toHaveBeenCalledWith({ identifier: mockedUser.email });
    });

    it('should throw UNAUTHORIZED if the password is incorrect', async () => {
      repo.findByIdentifier.mockResolvedValue(mockedUser as any);
      mockedUser.isPasswordCorrect.mockResolvedValue(false);

      await expectApiError(
        service.signInUser({
          identifier: mockedUser.email,
          password: mockedUser.password,
        }),
        HttpStatus.UNAUTHORIZED,
      );

      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
      expect(mockedUser.isPasswordCorrect).toHaveBeenCalledWith(mockedUser.password);
    });
  });

  describe('forgetPassword', () => {
    const mockedUser = {
      _id: 'user-id',
      email: 'user@email.com',
      refreshToken: 'refresh-token',
      otp: '123',
      password: '1234',
    };

    it('should sign in user and modify password if new password is provided', async () => {
      jest.spyOn(service, 'verifyOtp').mockResolvedValue(undefined as any);
      repo.findByIdentifier.mockResolvedValue(mockedUser as any);
      jest.spyOn(service, 'generateAccessAndRefreshToken').mockResolvedValue({
        refreshToken: 'refresh-token',
        accessToken: 'access-token',
      });
      repo.saveWithValidation.mockResolvedValue({} as any);

      const result = await service.forgetPassword({
        otp: mockedUser.otp,
        identifier: mockedUser.email,
        password: mockedUser.password,
      });

      expect(service.verifyOtp).toHaveBeenCalledWith({
        otp: mockedUser.otp,
        identifier: mockedUser.email,
      });
      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
      expect(service.generateAccessAndRefreshToken).toHaveBeenCalledWith(mockedUser._id);
      expect(repo.saveWithValidation).toHaveBeenCalled();
      expect(result).toEqual({
        refreshToken: 'refresh-token',
        accessToken: 'access-token',
      });
    });

    it('should throw NOT_FOUND if user does not exist', async () => {
      jest.spyOn(service, 'verifyOtp').mockResolvedValue(undefined as any);
      repo.findByIdentifier.mockResolvedValue(null);

      await expectApiError(
        service.forgetPassword({
          otp: mockedUser.otp,
          identifier: mockedUser.email,
          password: mockedUser.password,
        }),
        HttpStatus.NOT_FOUND,
      );

      expect(service.verifyOtp).toHaveBeenCalledWith({
        otp: mockedUser.otp,
        identifier: mockedUser.email,
      });
      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
    });
  });

  describe('isUniqueIdentifier', () => {
    it('should return true if user does not exists', async () => {
      repo.findByIdentifier.mockResolvedValue(null);

      const result = await service.isIdentifierUnique({ identifier: 'username' });

      expect(result).toBeTruthy();
      expect(repo.findByIdentifier).toHaveBeenCalledWith('username');
    });

    it('should return false if user exists', async () => {
      repo.findByIdentifier.mockResolvedValue({ _id: 'user-id', username: 'username' } as any);

      const result = await service.isIdentifierUnique({ identifier: 'username' });

      expect(result).toBeFalsy();
      expect(repo.findByIdentifier).toHaveBeenCalledWith('username');
    });
  });

  describe('generateRefreshAccessToken', () => {
    const mockedDbUser = {
      _id: 'user-id',
      email: 'one@email.com',
      refreshToken: 'refresh-token',
    };

    it('should generate refresh and access token', async () => {
      (mockDeps.jwt.verify as jest.Mock).mockReturnValue({ _id: mockedDbUser._id } as any);
      repo.findById.mockResolvedValue(mockedDbUser as any);
      const spy = jest.spyOn(service, 'generateAccessAndRefreshToken').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.generateRefreshAccessToken('refresh-token');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(mockDeps.jwt.verify).toHaveBeenCalledWith(
        'refresh-token',
        process.env.REFRESH_TOKEN_SECRET!,
      );
      expect(repo.findById).toHaveBeenCalledWith(mockedDbUser._id);
      expect(spy).toHaveBeenCalledWith(mockedDbUser._id);
    });

    it('should throw UNAUTHORIZED if token is not valid', async () => {
      await expectApiError(service.generateRefreshAccessToken(null), HttpStatus.UNAUTHORIZED);
    });

    it('should throw UNAUTHORIZED if user does not exist', async () => {
      (mockDeps.jwt.verify as jest.Mock).mockReturnValue({ _id: mockedDbUser._id } as any);
      repo.findById.mockResolvedValue(null);

      await expectApiError(
        service.generateRefreshAccessToken('refresh-token'),
        HttpStatus.UNAUTHORIZED,
      );

      expect(mockDeps.jwt.verify).toHaveBeenCalledWith(
        'refresh-token',
        process.env.REFRESH_TOKEN_SECRET!,
      );
      expect(repo.findById).toHaveBeenCalledWith(mockedDbUser._id);
    });

    it('should throw UNAUTHORIZED if refresh tokens does not match', async () => {
      (mockDeps.jwt.verify as jest.Mock).mockReturnValue({ _id: mockedDbUser._id } as any);
      repo.findById.mockResolvedValue(mockedDbUser as any);

      await expectApiError(
        service.generateRefreshAccessToken('wrong-token'),
        HttpStatus.UNAUTHORIZED,
      );

      expect(mockDeps.jwt.verify).toHaveBeenCalledWith(
        'wrong-token',
        process.env.REFRESH_TOKEN_SECRET!,
      );
      expect(repo.findById).toHaveBeenCalledWith(mockedDbUser._id);
    });
  });

  describe('getUser', () => {
    const mockedUser = {
      _id: 'user-id',
      email: 'user@email.com',
    };

    it('should find user by email or username', async () => {
      repo.findByIdentifier.mockResolvedValue(mockedUser as any);
      (mockDeps.userMapper.toPublicUser as jest.Mock).mockReturnValue(mockedUser as any);

      const result = await service.getUser(mockedUser.email);

      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
      expect(mockDeps.userMapper.toPublicUser).toHaveBeenCalledWith(mockedUser);
      expect(result).toEqual(mockedUser);
    });

    it('should throw NOT_FOUND if user does not exists', async () => {
      repo.findByIdentifier.mockResolvedValue(null);

      await expectApiError(service.getUser(mockedUser.email), HttpStatus.NOT_FOUND);

      expect(repo.findByIdentifier).toHaveBeenCalledWith(mockedUser.email);
    });
  });
});
