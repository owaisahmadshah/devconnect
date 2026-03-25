import { z } from 'zod';

import {
  createJobSchema as cs,
  deleteJobSchema as dj,
  updateJobSchema as us,
  getSearchJobBaseSchema as gsj,
  paginationSchema,
} from 'shared';

export const createJobSchema = z.object({
  body: cs,
});

export const deleteJobSchema = z.object({
  params: dj,
});

export const updateJobStatusSchema = z.object({
  body: us,
});

export const getSearchJobSchema = z.object({
  query: gsj.merge(paginationSchema).refine((data: any) => Object.values(data).some(Boolean), {
    message: 'At least one search parameter is required.',
  }),
});
