import { z } from 'zod';

import {
  basePostSchema,
  deletePostSchema,
  multipleBackendImagesSchema,
  paginationSchema,
  postByIdSchema,
  postsOfUserSchema,
} from 'shared';

export const createPostSchema = z.object({
  body: basePostSchema.omit({ media: true }),
  files: z.object({ media: multipleBackendImagesSchema }),
});

export const deletePostQuerySchema = z.object({
  query: deletePostSchema,
});

export const postByIdParamsSchema = z.object({
  params: postByIdSchema,
});

export const postsOfUserParamsSchema = z.object({
  params: postsOfUserSchema.optional().nullable(),
  query: paginationSchema,
});
