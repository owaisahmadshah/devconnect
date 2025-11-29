import { z } from 'zod';

import { createLikeSchema as cls } from 'shared';

export const createLikeSchema = z.object({
  body: cls,
});
