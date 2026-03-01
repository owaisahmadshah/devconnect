import * as z from 'zod';
import { baseJobSchema } from './job';

// For api request (create) - no _id required
export const createJobSchema = baseJobSchema;

// For api request (update) - _id required
export const updateJobSchema = z.object({
  _id: z.string(),
  status: z.enum(['open', 'closed']),
});

// For api request (delete) - _id required
export const deleteJobSchema = z.object({
  _id: z.string(),
});

// For typescript types
export type TCreateJob = z.infer<typeof createJobSchema>;
export type TUpdateJob = z.infer<typeof updateJobSchema>;
export type TDeleteJob = z.infer<typeof deleteJobSchema>;
