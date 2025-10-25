import { z } from 'zod';
import { baseMediaSchema } from '../project/media';
import { multipleBackendImagesSchema } from '../image/image';

// Base schema for post
export const basePostSchema = z.object({
  description: z.string(),
  links: z.array(z.string().url()),
  media: z.array(baseMediaSchema),
  createdBy: z.string(),
});

// For api request (create) - no _id required
// We will attach createdBy directly in the backend
export const createPostSchema = basePostSchema
  .omit({
    description: true,
    media: true,
    links: true,
    createdBy: true,
  })
  .extend({
    description: z.string().optional(),
    links: z.array(z.string().url()),
    createdBy: z.string().optional(), // Directly add it in frontend or just added the authenticated user from the backend
    media: multipleBackendImagesSchema.optional(),
  })
  .refine(data => data.description || (data.media && data.media.length > 0), {
    message: 'At least one of description or media is required',
    path: ['description'], // or path: ["media"], this is where the error will show
  });

// For api request (update) - _id required

// For api request (delete) - _id required
export const deletePostSchema = z.object({
  _id: z.string(),
});

// For typescript types
export type TBasePost = z.infer<typeof basePostSchema>;
export type TCreatePost = z.infer<typeof createPostSchema>;
export type TDeletePost = z.infer<typeof deletePostSchema>;
