import { z } from 'zod';

// For api request - get comments of a post by post id
export const postCommentsByIdSchema = z.object({
  postId: z.string().min(1, 'Post id is required'),
});

export type TPostCommentsByIdSchema = z.infer<typeof postCommentsByIdSchema>;
