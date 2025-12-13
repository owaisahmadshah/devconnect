import mongoose, { Document } from 'mongoose';
import { User } from '../models/user.model.js';

export class UserRepository {
  findById(userId: string) {
    return User.findById(userId);
  }

  findByIdentifier(identifier: string) {
    return User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
  }

  findByEmailOrUsername(email: string, username: string) {
    return User.findOne({
      $or: [{ email }, { username }],
    });
  }

  updateRefreshToken(userId: string, refreshToken: string) {
    return User.updateOne({ _id: userId }, { refreshToken });
  }

  updateVerificationStatus(userId: string, isVerified: boolean) {
    return User.updateOne({ _id: userId }, { isVerified });
  }

  create(userData: any, session?: mongoose.ClientSession) {
    if (session) {
      return User.create([userData], { session });
    }
    return User.create(userData);
  }

  save(doc: Document) {
    return doc.save({ validateBeforeSave: false });
  }

  saveWithValidation(doc: Document) {
    return doc.save();
  }
}
