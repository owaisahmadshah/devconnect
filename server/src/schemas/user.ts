import { z } from 'zod';

import {
  authUserSchemaServer,
  forgetPasswordSchema,
  resendOtpSchema,
  signInUserSchema,
  uniqueIdentifierSchema,
  verifyOtpSchema,
  userProfileParamsSchema as uPPS,
} from 'shared';

export const resendOtpBodySchema = z.object({
  body: resendOtpSchema,
});

export const authUserBodySchema = z.object({
  body: authUserSchemaServer,
});

export const uniqueIdentifierParamsSchema = z.object({
  params: uniqueIdentifierSchema,
});

export const forgetPasswordBodySchema = z.object({
  body: forgetPasswordSchema,
});

export const signInUserBodySchema = z.object({
  body: signInUserSchema,
});

export const verifyOtpBodySchema = z.object({
  body: verifyOtpSchema,
});

export const userProfileParamsSchema = z.object({
  params: uPPS,
});
