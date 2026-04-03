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
  profileId: z.string().optional(),
});

// Public user schema (safe to expose to frontend)
export const publicUserSchema = baseUserSchema.extend({
  _id: z.string(),
  isVerified: z.boolean(),
});

export const authUserSchemaServer = baseUserSchema.extend({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().optional(),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
});

// Frontend user schema for registration (Extending confirm password and checking it)
export const authUserSchemaClient = authUserSchemaServer
  .extend({
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: "Passwords don't match",
      });
    }
  });

export const signInUserSchema = z.object({
  identifier: z.string(), // username or email
  password: z.string().min(8),
});

// Otp verification schema
export const verifyOtpSchema = z.object({
  identifier: z.string(),
  otp: z.string().length(6),
});

export const resendOtpSchema = z.object({
  identifier: z.string(),
});

export const forgetPasswordSchema = z.object({
  identifier: z.string().min(2),
  otp: z.string().length(6),
  password: z.string().optional(),
});

export const uniqueIdentifierSchema = z.object({
  identifier: z.string(),
});

// Export typescript types from schemas
export type TBaseUser = z.infer<typeof baseUserSchema>;
export type TDbUser = z.infer<typeof dbUserSchema>;
export type TPublicUser = z.infer<typeof publicUserSchema>;
export type TAuthUserClient = z.infer<typeof authUserSchemaClient>;
export type TAuthUserServer = z.infer<typeof authUserSchemaServer>;
export type TSignInUser = z.infer<typeof signInUserSchema>;
export type TVerifyOtp = z.infer<typeof verifyOtpSchema>;
export type TResendOtp = z.infer<typeof resendOtpSchema>;
export type TForgetPassword = z.infer<typeof forgetPasswordSchema>;
export type TUniqueIdentifier = z.infer<typeof uniqueIdentifierSchema>;

export interface IUniqueIdentifierResponse {
  isUniqueIdentifier: boolean;
}
