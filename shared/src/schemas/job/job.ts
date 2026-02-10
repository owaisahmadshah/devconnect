import * as z from 'zod';

// Base schema
export const baseJobSchema = z.object({
  title: z.string().min(1, 'Job title is required.'),
  description: z.string().min(1, 'Job description is required.'),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  organizationId: z.string(),
  postedBy: z.string(),
  status: z.enum(['open', 'closed']).default('open'),
});

export type TBaseJob = z.infer<typeof baseJobSchema>;
