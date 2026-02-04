import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import type { TDbUser } from 'shared';

export interface IDbUser extends Document, TDbUser {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IDbUser>(
  {
    username: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      lowercase: true,
      required: [true, 'Username is required.'],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      required: [true, 'Email is required.'],
    },
    role: {
      type: String,
      enum: ['recruiter', 'developer'],
      default: 'developer',
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    github_id: { type: Number, unique: true, sparse: true },
    github_login: { type: String, default: '' },
    github_access_token: { type: String, default: '' },
    github_access_token_type: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

// Use regular function (not arrow) for `this` binding
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add instance methods
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      profileId: this.profileId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    // { expiresIn: process.env.ACCESS_TOKEN_SECRET },
    { expiresIn: '1h' },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    // { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    { expiresIn: '14d' },
  );
};

export const User = model<IDbUser>('User', userSchema);
