import { z } from "zod"

// Base profile urls
export const baseProfileUrlsSchema = z.object({
  username: z.string().min(1, ''),
});

// For API request (create) - no _id
export const createProfileUrlsSchema = baseProfileUrlsSchema;

// For API request (update) - no _id
export const updateProfileUrlsSchema = baseProfileUrlsSchema.extend({
  _id: z.string().min(1, '_id is needed'),
});

// For frontend and API response
export const profileUrlsWithIdSchema = baseProfileUrlsSchema.extend({
  _id: z.string().min(1, '_id is needed'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for typescript
export type TBaseProfilUrls = z.infer<typeof baseProfileUrlsSchema>;
export type TCreateProfileUrls = z.infer<typeof createProfileUrlsSchema>;
export type TUpdateProfileUrls = z.infer<typeof updateProfileUrlsSchema>;
export type TProfileUrlsWithId = z.infer<typeof profileUrlsWithIdSchema>;
