import * as z from 'zod';

import {
  createOrganizationSchema as cs,
  deleteOrganizationSchema as ds,
  paginationSchema,
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
