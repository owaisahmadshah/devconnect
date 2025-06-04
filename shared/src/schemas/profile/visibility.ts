import { z } from 'zod';

// Enum for visibility settings in the profile
export const visibilityEnum = z.enum(['Private', 'Public', 'connections-only']);

// Visibility schema: defines visibility settings for various profile sections
export const baseVisibilitySchema = z.object({
  education: visibilityEnum,
  skills: visibilityEnum,
  experience: visibilityEnum,
  certifications: visibilityEnum,
});

// For API request (create) - no _id
export const createVisibilitySchema = baseVisibilitySchema;

// For API request (update) - no _id because
// it is just a single object and
// it doesn't have _id
export const updateVisibilitySchema = baseVisibilitySchema.partial().refine(
  data => {
    return Object.keys(data).length > 0;
  },
  {
    message: 'At least one field must be provided for update',
  },
);

// For frontend and API response
export const fullVisibilitySchema = baseVisibilitySchema;

// Types for typescript
export type TBaseVisibility = z.infer<typeof baseVisibilitySchema>;
export type TCreateVisibility = z.infer<typeof createVisibilitySchema>;
export type TUpdateVisibility = z.infer<typeof updateVisibilitySchema>;
export type TFullVisibility = z.infer<typeof fullVisibilitySchema>;
