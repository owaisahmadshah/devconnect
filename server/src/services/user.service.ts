import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

import { UserMapper } from '../mapper/user.mapper.js';
import { ApiError } from '../utils/ApiError.js';
import sendEmail from '../utils/emailSender.js';
import { generateExpiryTime, generateOTP } from '../utils/generateOtpCodeAndExpiry.js';
import { Profile } from '../models/profile.model.js';
import logger from '../utils/logger.js';
import {
  getDefaultMessageForStatus,
  HttpStatus,
  type TAuthUserServer,
  type TForgetPassword,
  type TResendOtp,
  type TSignInUser,
  type TVerifyOtp,
  type TUniqueIdentifier,
  type TPublicUser,
} from 'shared';
import type { UserRepository } from '../repositories/user.repository.js';

export class UserService {
  constructor(private repo: UserRepository) {}

  generateAccessAndRefreshToken = async (
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const user = await this.repo.findById(userId);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, getDefaultMessageForStatus(HttpStatus.NOT_FOUND));
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await this.repo.updateRefreshToken(user._id as string, refreshToken);

    return { accessToken, refreshToken };
  };

  verifyOtp = async (userData: TVerifyOtp): Promise<{ isValidOtp: boolean }> => {
    const user = await this.repo.findByIdentifier(userData.identifier);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, getDefaultMessageForStatus(HttpStatus.NOT_FOUND));
    }

    const { otp, otpExpiry } = user;

    if (new Date() > otpExpiry) {
      throw new ApiError(HttpStatus.GONE, 'OTP expired. Please request a new one.');
    }

    if (otp !== userData.otp) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Incorrect OTP. Please try again.');
    }

    if (!user.isVerified) {
      await this.repo.updateVerificationStatus(user._id as string, true);
    }

    return { isValidOtp: true };
  };

  /**
   * Resends OTP to the user's email
   * Returns void as this operation doesn't need to return any data
   * The controller should use HttpStatus.NO_CONTENT (204) for the response
   */
  resendOtp = async (userData: TResendOtp): Promise<void> => {
    const user = await this.repo.findByIdentifier(userData.identifier);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, getDefaultMessageForStatus(HttpStatus.NOT_FOUND));
    }

    const otpCode = generateOTP();
    const otpExpiry = generateExpiryTime();

    // Sending otp email
    const isOtpSent = await sendEmail(user.email, otpCode);
    if (!isOtpSent) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        getDefaultMessageForStatus(HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }

    user.otp = otpCode;
    user.otpExpiry = otpExpiry;

    await this.repo.save(user);

    return;
  };

  /**
   * Creates a new user and associated profile
   * Returns void as this operation doesn't need to return data
   * The controller should use HttpStatus.CREATED (201) for the response
   */
  createUser = async (userData: TAuthUserServer): Promise<void> => {
    // Check if user already exists
    const existingUser = await this.repo.findByEmailOrUsername(userData.email, userData.username);

    if (existingUser) {
      throw new ApiError(HttpStatus.CONFLICT, 'User with this email or username already exists');
    }

    const otpCode = generateOTP();
    const otpExpiry = generateExpiryTime();

    // Sending otp email
    const isOtpSent = await sendEmail(userData.email, otpCode);
    if (!isOtpSent) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        getDefaultMessageForStatus(HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }

    const dbUserData = UserMapper.toDbUser(userData, otpCode, otpExpiry);

    // Start transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // The destructuring syntax [user] is used to get the first element from the array
      // that Mongoose's create() returns when used with a transaction
      const [user] = await this.repo.create(dbUserData, session);

      if (!user) {
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create user.');
      }

      const baseSlug = (slugify as any)(`${userData.firstName} ${userData.lastName || ''}`, {
        lower: true,
        strict: true,
      });

      let slug = baseSlug;
      let attempt = 0;
      let uniqueSlugFound = false;

      while (!uniqueSlugFound) {
        try {
          await Profile.create(
            [
              {
                user: user._id,
                firstName: userData.firstName,
                lastName: userData.lastName || '',
                profileUrls: [{ url: slug }],
              },
            ],
            { session },
          );

          uniqueSlugFound = true; // success
        } catch (err: any) {
          if (err.code === 11000) {
            // Duplicate key error modify slug
            attempt++;

            if (attempt === 1) {
              // First retry append email prefix
              slug = `${baseSlug}-${userData.email.split('@')[0]}`;
            } else {
              // Further retries → append random number
              slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
            }
          } else {
            throw err;
          }
        }
      }

      // Explicitly commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      } else if (error instanceof mongoose.MongooseError) {
        logger.error('Invalid credentials for signup:', error.message);
        throw new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, error.message);
      } else {
        logger.error('Error in user creation transaction:', error);
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create user. Please try again',
        );
      }
    } finally {
      session.endSession();
    }
  };

  signInUser = async (
    userData: TSignInUser,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const user = await this.repo.findByIdentifier(userData.identifier);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found.');
    }

    if (!user.isVerified) {
      // Resending otp
      await this.resendOtp({ identifier: userData.identifier as string });

      throw new ApiError(
        HttpStatus.FORBIDDEN,
        'Account not verified. Please verify your account with the OTP sent to your email.',
      );
    }

    const isPasswordValid = await user.isPasswordCorrect(userData.password);
    if (!isPasswordValid) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Incorrect password. Please try again.');
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshToken(
      user._id as string,
    );

    return { accessToken, refreshToken };
  };

  forgetPassword = async (
    userData: TForgetPassword,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    await this.verifyOtp({ identifier: userData.identifier, otp: userData.otp });

    const user = await this.repo.findByIdentifier(userData.identifier);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found.');
    }

    if (userData.password) {
      user.password = userData.password;
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshToken(
      user._id as string,
    );

    user.refreshToken = refreshToken;
    await this.repo.saveWithValidation(user);

    return { accessToken, refreshToken };
  };

  isIdentifierUnique = async (userData: TUniqueIdentifier): Promise<boolean> => {
    const user = await this.repo.findByIdentifier(userData.identifier);

    if (!user) {
      return true;
    }

    return false;
  };

  generateRefreshAccessToken = async (
    token: string | null,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    if (!token) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Refresh token is required');
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);

    const user = await this.repo.findById((decodedToken as any)._id);

    if (!user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    if (token !== user.refreshToken) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshToken(
      user._id as string,
    );

    return { accessToken, refreshToken };
  };

  getUser = async (identifier: string): Promise<TPublicUser> => {
    const user = await this.repo.findByIdentifier(identifier);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User with this email or username not found.');
    }

    const responseUser: TPublicUser = UserMapper.toPublicUser(user);

    return responseUser;
  };
}
