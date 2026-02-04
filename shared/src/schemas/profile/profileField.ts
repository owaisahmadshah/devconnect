import { z } from 'zod';
import { connectionPendingState } from '../connection/connection';

// For API request (update) - requires _id, we'll get it from req.user
export const updateProfileFieldSchema = z
  .discriminatedUnion('fieldName', [
    z.object({
      fieldName: z.literal('firstName'),
      fieldData: z.string().min(1, 'First name is required'),
    }),
    z.object({
      fieldName: z.literal('lastName'),
      fieldData: z.string(),
    }),
    z.object({
      fieldName: z.literal('phoneNumber'),
      fieldData: z.string(),
    }),
    z.object({
      fieldName: z.literal('bio'),
      fieldData: z.string(),
    }),
    // z.object({
    //   fieldName: z.literal('isVerified'),
    //   fieldData: z.boolean(),
    // }),
  ])
  .refine(data => !!data.fieldName, {
    message: 'At least one field must be provided for update',
  });

export type TUpdateProfileField = z.infer<typeof updateProfileFieldSchema>;
