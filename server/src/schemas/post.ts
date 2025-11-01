import { z } from 'zod';

import {
  createPostSchema as cps,
  deletePostSchema,
  multipleBackendImagesSchema,
  paginationSchema,
  postByIdSchema,
  postsOfUserSchema,
} from 'shared';

export const createPostSchema = z.object({
  body: cps,
  files: z.object({ media: multipleBackendImagesSchema.optional() }).optional(),
});

export const deletePostQuerySchema = z.object({
  query: deletePostSchema,
});

export const postByIdParamsSchema = z.object({
  params: postByIdSchema,
});

export const postsOfUserParamsSchema = z.object({
  params: postsOfUserSchema,
  query: paginationSchema,
});
