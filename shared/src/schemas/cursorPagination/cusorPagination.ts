import { z } from 'zod';

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

export const validateSearchParamsPaginationSchema = z.object({
  limit: z.coerce.number().default(10),
  cursor: z.string().nullable().default(null),
});

export type TPagination = z.infer<typeof paginationSchema>;
export type TValidateSearchParamsPagination = z.infer<typeof validateSearchParamsPaginationSchema>;
