import * as z from 'zod';

import {
  createOrganizationMemberSchema as cs,
  deleteOrganizationMemberSchema as ds,
  updateOrganizationMemberRoleSchema as us,
  createOrganizationMemberInviteSchema as comis,
  deleteOrganizationMemberInviteSchema as domis,
  updateOrganizationMemberInviteSchema as uomis,
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

export const deleteOrganizationMemberInviteSchema = z.object({
  params: domis
})

export const updateOrganizationMemberInviteSchema = z.object({
  params: uomis
})
