import { z } from 'zod';

import {
  authUserSchemaServer,
  forgetPasswordSchema,
  resendOtpSchema,
  signInUserSchema,
  verifyOtpSchema,
} from 'shared';

export const resendOtpBodySchema = z.object({
  body: resendOtpSchema,
});

export const authUserBodySchema = z.object({
  body: authUserSchemaServer,
});

export const uniqueIdentifierParamsSchema = z.object({
  params: z.object({
    identifier: z.string(),
  }),
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

export type TUniqueIdentifier = z.infer<typeof uniqueIdentifierParamsSchema>['params'];
