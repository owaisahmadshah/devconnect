import { z } from 'zod';

export const baseCommentSchema = z.object({
  postId: z.string(),
  body: z.string().min(1),
  commentBy: z.string().optional(),
});

// For api request (create) - no _id required
export const createCommentSchema = baseCommentSchema;

// For api request (delete) - _id required
export const deleteCommentSchema = z.object({
  _id: z.string(),
});

export type TBaseComment = z.infer<typeof baseCommentSchema>;
export type TCreateComment = z.infer<typeof createCommentSchema>;
export type TDeleteCommentSchema = z.infer<typeof deleteCommentSchema>;
