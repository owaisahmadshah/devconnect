import { z } from 'zod';

import {
  addProfileArrayFieldSchema,
  userProfileParamsSchema as uPPS,
  deleteProfileArrayItemSchema,
  singleBackendImageSchema,
  updateProfileFieldSchema,
  fullNameSearchSchema as fNSS,
  paginationSchema,
} from 'shared';

export const userProfileUpdateArrayDataBodySchema = z.object({
  body: addProfileArrayFieldSchema,
});

export const userProfileParamsSchema = z.object({
  params: uPPS,
});

export const userProfileDeleteArrayDataBodySchema = z.object({
  query: deleteProfileArrayItemSchema,
});

export const userProfilePictureUpdateSchema = z.object({
  file: singleBackendImageSchema,
});

export const userProfileFieldUpdateSchema = z.object({
  body: updateProfileFieldSchema,
});

export const fullNameSearchSchemas = z.object({
  query: fNSS.extend(paginationSchema.shape),
});

export const recommendConnectionsRouteSchema = z.object({
  query: paginationSchema,
});
