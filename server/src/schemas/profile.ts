import { z } from 'zod';

import {
  addProfileArrayFieldSchema,
  userProfileParamsSchema as uPPS,
  deleteProfileArrayItemSchema,
  singleBackendImageSchema,
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
