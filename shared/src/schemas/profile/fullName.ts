import { z } from 'zod';

export const fullNameBaseSearchSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
});

export const fullNameSearchSchema = fullNameBaseSearchSchema;

export type TFullNameBaseSearch = z.infer<typeof fullNameBaseSearchSchema>;
export type TFullNameSearch = z.infer<typeof fullNameSearchSchema>;
