import { z } from 'zod';

// Media schema: represents a media(specifically a url, maybe a picture or a video)
export const baseMediaSchema = z.object({ url: z.string(), type: z.enum(['video', 'image']) });

// For API request (create) - no _id
export const createMediaSchema = baseMediaSchema;

// For frontend and API responses
export const mediaWithIdSchema = baseMediaSchema.extend({ _id: z.string() });

// For typescript types
export type TBaseMedia = z.infer<typeof baseMediaSchema>;
export type TCreateMedia = z.infer<typeof createMediaSchema>;
export type TMediaWithId = z.infer<typeof mediaWithIdSchema>;
