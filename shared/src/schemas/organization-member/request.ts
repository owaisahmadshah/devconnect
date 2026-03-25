import * as z from 'zod';

import { baseOrganizationMemberSchema } from './organization-member';

// For api request (add member) - no _id required
export const createOrganizationMemberSchema = baseOrganizationMemberSchema.extend({
  status: z.enum(['pending', 'accepted']).optional(),
});

// For api request (update member role) - _id required
export const updateOrganizationMemberRoleSchema = z.object({
  _id: z.string(),
  role: z.enum(['admin', 'member']),
  organizationId: z.string(),
  actorId: z.string().optional(),
});

// For api request (remove member) - _id required
export const deleteOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
});

// For api request (change member role) - _id required
export const changeOrganizationMemberRoleSchema = z.object({
  organizationId: z.string(),
  role: z.enum(['admin', 'member']),
});

// For api request (invite member) - _id required
export const createOrganizationMemberInviteSchema = z.object({
  organizationId: z.string(),
  role: z.enum(['admin', 'member']),
  userId: z.string(),
  status: z.enum(['pending', 'accepted']).optional(),
});

export type TCreateOrganizationMember = z.infer<typeof createOrganizationMemberSchema>;
export type TUpdateOrganizationMemberRole = z.infer<typeof updateOrganizationMemberRoleSchema>;
export type TDeleteOrganizationMember = z.infer<typeof deleteOrganizationMemberSchema>;
export type TChangeOrganizationMemberRole = z.infer<typeof changeOrganizationMemberRoleSchema>;
export type TCreateOrganizationMemberInvite = z.infer<typeof createOrganizationMemberInviteSchema>;
