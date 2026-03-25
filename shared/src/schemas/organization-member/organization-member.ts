import * as z from 'zod';

export const organizationMemberRoleSchema = z.enum(['admin', 'member']);

// Base schema
export const baseOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(['admin', 'member']),
});

export type TBaseOrganizationMember = z.infer<typeof baseOrganizationMemberSchema>;
export type TOrganizationMemberRole = z.infer<typeof organizationMemberRoleSchema>;
