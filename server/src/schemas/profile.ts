import { z } from 'zod';

import { userProfileUpdateArrayDataSchema, userProfileParamsSchema as uPPS } from 'shared';

export const userProfileUpdateArrayDataBodySchema = z.object({
  body: userProfileUpdateArrayDataSchema,
});

export const userProfileParamsSchema = z.object({
  params: uPPS,
});
