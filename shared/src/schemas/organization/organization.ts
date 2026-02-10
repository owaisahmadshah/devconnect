import * as z from 'zod';

// Base schema
export const baseOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required.'),
  logo: z.string(),
  description: z.string(),
  websiteURL: z.string(),
  createdBy: z.string(),
});

export type TBaseOrganization = z.infer<typeof baseOrganizationSchema>;
