import { z } from 'zod';

// Tags schema: represents a tag
export const baseTagSchema = z.object({ tag: z.string() });

// For API request (create) - no _id
export const createTagSchema = baseTagSchema;

// For frontend and API responses
export const tagWithIdSchema = baseTagSchema.extend({ _id: z.string() });

// For typescript types
export type TBaseTag = z.infer<typeof baseTagSchema>;
export type TCreateTag = z.infer<typeof createTagSchema>;
export type TTagWithId = z.infer<typeof tagWithIdSchema>;
