import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  role: 'recruiter' | 'developer';
  refreshToken: string;
  password: string;
}
