import * as z from 'zod';

// Base schema
export const baseOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum(['admin', 'member']),
});

export type TBaseOrganizationMember = z.infer<typeof baseOrganizationMemberSchema>;
