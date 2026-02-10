import * as z from 'zod';

import { baseOrganizationMemberSchema } from './organization-member';

// For api request (add member) - no _id required
export const createOrganizationMemberSchema = baseOrganizationMemberSchema;

// For api request (update member role) - _id required
export const updateOrganizationMemberRoleSchema = z.object({
  _id: z.string(),
  role: z.enum(['admin', 'member']),
});

// For api request (remove member) - _id required
export const removeOrganizationMemberSchema = z.object({
  _id: z.string(),
});

export type TAddOrganizationMember = z.infer<typeof createOrganizationMemberSchema>;
export type TUpdateOrganizationMemberRole = z.infer<typeof updateOrganizationMemberRoleSchema>;
export type TRemoveOrganizationMember = z.infer<typeof removeOrganizationMemberSchema>;
