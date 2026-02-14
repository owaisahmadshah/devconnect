import * as z from 'zod';

import { baseOrganizationSchema } from './organization';

// For api request (create) - no _id required
// We will attach createdBy directly in the backend
export const createOrganizationSchema = baseOrganizationSchema.omit({ organizationURL: true });

// For api request (update) - _id required

// For api request (delete) - _id required
export const deleteOrganizationSchema = z.object({
  _id: z.string(),
});

// For typescript types
export type TCreateOrganization = z.infer<typeof createOrganizationSchema>;
export type TDeleteOrganization = z.infer<typeof deleteOrganizationSchema>;
