import { z } from 'zod';

export const likeEnum = z.enum(['like', 'love', 'dislike', 'delete']);

export const baseLikeSchema = z.object({
  postId: z.string(),
  value: likeEnum,
  likedBy: z.string().optional(),
  postOwnerId: z.string().optional(),
});

export const createLikeSchema = baseLikeSchema;

export type TlikeEnum = z.infer<typeof likeEnum>;
export type TBaseLike = z.infer<typeof baseLikeSchema>;
export type TCreateLike = z.infer<typeof createLikeSchema>;

// =========== Response ========
export type TLikeResponse = {
  isCreated: boolean;
};
