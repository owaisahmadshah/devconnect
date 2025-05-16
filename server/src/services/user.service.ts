import bcrypt from 'bcrypt';

import { User } from '../models/user.model.js';
import { UserMapper } from '../mapper/user.mapper.js';
import { ApiError } from '../utils/ApiError.js';
import type { TAuthUser } from 'shared';
import sendEmail from '../utils/emailSender.js';
import { generateExpiryTime, generateOTP } from '../utils/generateOtpCodeAndExpiry.js';
import { Profile } from '../models/profile.model.js';
import mongoose from 'mongoose';

export class UserService {
  static async generateAccessAndRefreshToken(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found.');
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

  static async createUser(userData: TAuthUser): Promise<void> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email or username already exists');
    }

    const otpCode = generateOTP();
    const otpExpiry = generateExpiryTime();
    const hashedPassword = await this.#hashPassword(userData.password);

    // Sending otp email
    const isOtpSent = await sendEmail(userData.email, otpCode);
    if (!isOtpSent) {
      throw new ApiError(500, 'Internal server error');
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
        throw new ApiError(500, 'Unable to create user.');
      }

      // Now we're sure user exists and has an _id
      await Profile.create(
        [
          {
            user: user._id,
            firstname: '',
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
      } else {
        console.error('Error in user creation transaction:', error);
        throw new ApiError(500, 'Failed to create user account. Please try again.');
      }
    } finally {
      session.endSession();
    }
  }
}

export class UserActionsService extends UserService {}
