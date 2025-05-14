import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import type { IUser } from '../types/user.type.js';

const userSchema = new Schema<IUser>({
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
    time: true,
    index: true,
    required: [true, 'Email is required.'],
  },
  role: {
    type: String,
    enum: ['recruiter', 'developer'],
    default: 'developer',
  },
  refreshToken: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
});

// Arrow functions are not recommended here
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// TODO: Add generateAccessToken and generateRefreshToken methods

export const User = model('User', userSchema);
