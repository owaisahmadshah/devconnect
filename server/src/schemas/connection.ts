import * as z from 'zod';

import {
  createConnectionSchema,
  deleteConnectionSchema,
  paginationSchema,
  updateConnectionSchema,
} from 'shared';

export const createConnectionRouteSchema = z.object({
  body: createConnectionSchema,
});

export const updateConnectionRouteSchema = z.object({
  body: updateConnectionSchema,
});

export const deleteConnectionRouteSchema = z.object({
  query: deleteConnectionSchema,
});

export const connectionPaginatedRouteSchema = z.object({
  query: paginationSchema,
});
