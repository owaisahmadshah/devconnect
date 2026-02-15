import { z } from 'zod';

import { createJobSchema as cs, deleteJobSchema as dj, updateJobSchema as us } from 'shared';

export const createJobSchema = z.object({
  body: cs,
});

export const deleteJobSchema = z.object({
  params: dj,
});

export const updateJobStatusSchema = z.object({
  body: us,
});
