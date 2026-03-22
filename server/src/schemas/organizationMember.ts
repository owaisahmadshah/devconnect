import * as z from 'zod';

import {
  createOrganizationMemberSchema as cs,
  deleteOrganizationMemberSchema as ds,
  updateOrganizationMemberRoleSchema as us,
  createOrganizationMemberInviteSchema as comis,
} from 'shared';

export const createOrganizationMemberBodySchema = z.object({
  body: cs,
});

export const createManyOrganizationMembersBodySchema = z.object({
  body: z.array(cs),
});

export const deleteOrganizationMemberQuerySchema = z.object({
  params: ds,
});

export const updateOrganizationMemberRoleBodySchema = z.object({
  body: us,
});

export const createOrganizationMemberInviteSchema = z.object({
  body: comis,
});
