import { z } from 'zod';

// Base user schema (common fields)
export const baseUserSchema = z.object({
  username: z
    .string()
    .min(4, 'User must contain at least 4 characters.')
    .max(40, 'User must contain more than 40 characters.'),
  email: z.string().email(),
  role: z.enum(['recruiter', 'developer']),
});

// Database user schema (All fields for backend)
export const dbUserSchema = baseUserSchema.extend({
  password: z.string().min(8),
  refreshToken: z.string(),
  otp: z.string().length(6),
  otpExpiry: z.date(),
  isVerified: z.boolean(),
});

// Public user schema (safe to expose to frontend)
export const publicUserSchema = baseUserSchema.extend({
  _id: z.string(),
  isVerified: z.boolean(),
});

// Auth user schema (for login/registration)
export const authUserSchema = z.object({
  body: baseUserSchema.extend({
    password: z.string().min(8, 'Password must contain at least 8 characters.'),
  }),
});

// Export typescript types from schemas
export type TBaseUser = z.infer<typeof baseUserSchema>;
export type TDbUser = z.infer<typeof dbUserSchema>;
export type TPublicUser = z.infer<typeof publicUserSchema>;
export type TAuthUser = z.infer<typeof authUserSchema>['body'];
