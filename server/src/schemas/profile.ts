import { z } from 'zod';

import {
  userProfileUpdateArrayDataSchema,
  userProfileParamsSchema as uPPS,
  userProfileDeleteArrayDataSchema,
} from 'shared';

export const userProfileUpdateArrayDataBodySchema = z.object({
  body: userProfileUpdateArrayDataSchema,
});

export const userProfileParamsSchema = z.object({
  params: uPPS,
});

export const userProfileDeleteArrayDataBodySchema = z.object({
  query: userProfileDeleteArrayDataSchema,
});
