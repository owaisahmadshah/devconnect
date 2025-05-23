import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { User } from '../models/user.model.js';
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
} from 'shared';

export class UserService {
  static async generateAccessAndRefreshToken(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, getDefaultMessageForStatus(HttpStatus.NOT_FOUND));
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    // Skip validation as we're only updating the refresh token
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  // Private method for password hashing
  static async #hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async verifyOtp(userData: TVerifyOtp): Promise<{ isValidOtp: boolean }> {
    const user = await User.findOne({
      $or: [{ email: userData.identifier }, { username: userData.identifier }],
    });

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
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    return { isValidOtp: true };
  }

  /**
   * Resends OTP to the user's email
   * Returns void as this operation doesn't need to return any data
   * The controller should use HttpStatus.NO_CONTENT (204) for the response
   */
  static async resendOtp(userData: TResendOtp): Promise<void> {
    const user = await User.findOne({
      $or: [{ username: userData.identifier }, { email: userData.identifier }],
    });

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

    await user.save({ validateBeforeSave: false });

    return;
  }

  /**
   * Creates a new user and associated profile
   * Returns void as this operation doesn't need to return data
   * The controller should use HttpStatus.CREATED (201) for the response
   */
  static async createUser(userData: TAuthUserServer): Promise<void> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new ApiError(HttpStatus.CONFLICT, 'User with this email or username already exists');
    }

    const otpCode = generateOTP();
    const otpExpiry = generateExpiryTime();
    const hashedPassword = await this.#hashPassword(userData.password);

    // Sending otp email
    const isOtpSent = await sendEmail(userData.email, otpCode);
    if (!isOtpSent) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        getDefaultMessageForStatus(HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }

    const dbUserData = UserMapper.toDbUser(userData, hashedPassword, otpCode, otpExpiry);

    // Start transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // The destructuring syntax [user] is used to get the first element from the array
      // that Mongoose's create() returns when used with a transaction
      const [user] = await User.create([dbUserData], { session });

      if (!user) {
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to create user.');
      }

      // Now we're sure user exists and has an _id
      await Profile.create(
        [
          {
            user: user._id,
            firstName: userData.firstName,
            lastName: userData.lastName ? userData.lastName : '',
          },
        ],
        { session },
      );

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
          'Faild to create user. Please try again',
        );
      }
    } finally {
      session.endSession();
    }
  }

  static async signInUser(
    userData: TSignInUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findOne({
      $or: [{ email: userData.identifier }, { username: userData.identifier }],
    });

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
  }

  static async forgetPassword(
    userData: TForgetPassword,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.verifyOtp({ identifier: userData.identifier, otp: userData.otp });

    const user = await User.findOne({
      $or: [{ username: userData.identifier }, { email: userData.identifier }],
    });

    if (!user) {
      throw new ApiError(404, 'Usern not found.');
    }

    if (userData.password) {
      const hashedPassword = await this.#hashPassword(userData.password);
      user.password = hashedPassword;
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshToken(
      user._id as string,
    );

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  static async isIdentifierUnique(userData: TUniqueIdentifier): Promise<boolean> {
    const user = await User.findOne({
      $or: [{ username: userData.identifier }, { email: userData.identifier }],
    });

    if (!user) {
      return true;
    }

    return false;
  }
}
