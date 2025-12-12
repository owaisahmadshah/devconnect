import { z } from 'zod';

import {
  createCommentSchema,
  deleteCommentSchema,
  paginationSchema,
  postCommentsByIdSchema,
} from 'shared';

export const createCommentBodySchema = z.object({
  body: createCommentSchema,
});

export const deleteCommentQuerySchema = z.object({
  query: deleteCommentSchema,
});

export const postCommentsByIdQuerySchema = z.object({
  params: postCommentsByIdSchema,
  query: paginationSchema,
});
