import { z } from 'zod';

// Get post by id
export const postByIdSchema = z.object({
  postId: z.string().min(1, 'Post id is required'),
});

// Gell all posts of a unique user
export const postsOfUserSchema = z.object({
  profileUrl: z.string().optional(),
});

// Types for typescript
export type TPostById = z.infer<typeof postByIdSchema>;
export type TPostOfUser = z.infer<typeof postsOfUserSchema>;
