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

// Auth user schema (for registration)
export const authUserSchema = z.object({
  body: baseUserSchema.extend({
    firstName: z.string().min(2, 'First name required'),
    lastName: z.string().optional(),
    password: z.string().min(8, 'Password must contain at least 8 characters.'),
  }),
});

// Login user schema
export const signInUserSchema = z.object({
  body: z.object({
    identifier: z.string(), // username or email
    password: z.string().min(8),
  }),
});

// Otp verification schema
export const verifyOtpSchema = z.object({
  body: z.object({
    identifier: z.string(),
    otp: z.string().length(6),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    identifier: z.string(),
  }),
});

// Export typescript types from schemas
export type TBaseUser = z.infer<typeof baseUserSchema>;
export type TDbUser = z.infer<typeof dbUserSchema>;
export type TPublicUser = z.infer<typeof publicUserSchema>;
export type TAuthUser = z.infer<typeof authUserSchema>['body'];
export type TSignInUser = z.infer<typeof signInUserSchema>['body'];
export type TVerifyOtp = z.infer<typeof verifyOtpSchema>['body'];
export type TResendOtp = z.infer<typeof resendOtpSchema>['body'];
