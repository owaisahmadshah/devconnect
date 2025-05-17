import mongoose from 'mongoose';

import {
  dbUserSchema,
  publicUserSchema,
  type TAuthUser,
  type TDbUser,
  type TPublicUser,
} from 'shared';

/**
 * User Mapper class - responsible for transforming user data between different layers
 */
export class UserMapper {
  /**
   * Transforms a database user to a public user (safe for client exposure)
   */
  static toPublicUser(user: TDbUser | mongoose.Document): TPublicUser {
    const userObj = user instanceof mongoose.Document ? user.toObject() : user;

    const publicUser = publicUserSchema.parse({
      _id: userObj._id,
      username: userObj.username,
      email: userObj.email,
      role: userObj.role,
      isVerified: userObj.isVerified,
    });

    return publicUser;
  }

  /**
   * Transforms an auth user to db user
   */
  static toDbUser(user: TAuthUser, hashedPassword: string, otp: string, otpExpiry: Date): TDbUser {
    const dbUser = dbUserSchema.parse({
      username: user.username,
      email: user.email,
      isVerified: false,
      role: user.role,
      refreshToken: '',
      otp: otp,
      otpExpiry: otpExpiry,
      password: hashedPassword,
    });
    return dbUser;
  }
}
