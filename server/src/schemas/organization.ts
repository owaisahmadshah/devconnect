import * as z from 'zod';

import {
  createOrganizationSchema as cs,
  deleteOrganizationSchema as ds,
  paginationSchema,
  singleBackendImageSchema,
} from 'shared';

export const createOrganizationBodySchema = z.object({
  body: cs,
});

export const deleteOrganizationQuerySchema = z.object({
  params: ds,
});

export const getOrganizationsQuerySchema = z.object({
  query: paginationSchema,
});

// Make sure it is consistent with the shared schema for update organization field request
export const updateOrganizationFieldSchema = z.object({
  params: z.object({
    organizationId: z.string(),
  }),
  body: z.object({
    field: z.enum(['description', 'websiteURL']),
    value: z.string(),
  }),
});

export const organizationLogoUpdateSchema = z.object({
  file: singleBackendImageSchema,
});
