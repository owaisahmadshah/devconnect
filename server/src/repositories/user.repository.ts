import mongoose, { Document } from 'mongoose';
import { User } from '../models/user.model.js';
import type { TAuthProvider } from '../types/user.type.js';

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

  findByAuthProviderId(provider: TAuthProvider, providerId: string) {
    return User.findOne({ authProvider: provider, providerId });
  }

  create(userData: any, session?: mongoose.ClientSession) {
    if (session) {
      return User.create([userData], { session });
    }
    return User.create(userData);
  }

  updateRefreshToken(userId: string, refreshToken: string) {
    return User.updateOne({ _id: userId }, { refreshToken });
  }

  updateVerificationStatus(userId: string, isVerified: boolean) {
    return User.updateOne({ _id: userId }, { isVerified });
  }

  linkAuthProviderAccount(userId: string, provider: TAuthProvider, providerId: string) {
    return User.findByIdAndUpdate(userId, { provider, providerId }, { new: true });
  }

  save(doc: Document) {
    return doc.save({ validateBeforeSave: false });
  }

  saveWithValidation(doc: Document) {
    return doc.save();
  }
}
