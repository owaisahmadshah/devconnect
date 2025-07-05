import { z } from 'zod';

// Project base request schema
export const paginationSchema = z.object({
  limit: z
    .string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val > 0 && val <= 100, {
      message: 'Limit must be a number between 1 and 100',
    })
    .optional(),

  cursor: z.string().nullable().optional(),
});

export type TPagination = z.infer<typeof paginationSchema>;
