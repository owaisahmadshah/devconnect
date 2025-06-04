import { z } from 'zod';

// Social media link schema: social platform and corresponding link
export const baseSocialMediaLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  link: z.string().min(1, 'Platform link/url is required'),
});

// For API request (create) - no _id
export const createSocialMediaLinkSchema = baseSocialMediaLinkSchema;

// For API request (update) - requires _id
export const updateSocialMediaLinkSchema = baseSocialMediaLinkSchema
  .partial()
  .extend({
    _id: z.string().min(1, '_id is required'),
  })
  .refine(
    data => {
      const { _id, ...updateData } = data;
      return Object.keys(updateData).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    },
  );

// For frontend and API response
export const socialMediaLinkWithIdSchema = baseSocialMediaLinkSchema.extend({
  _id: z.string().min(1, '_id is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for typescript
export type TBaseSocialMediaLink = z.infer<typeof baseSocialMediaLinkSchema>;
export type TCreateSocialMediaLink = z.infer<typeof createSocialMediaLinkSchema>;
export type TUpdateSocialMediaLink = z.infer<typeof updateSocialMediaLinkSchema>;
export type TSocialMediaLinkWithId = z.infer<typeof socialMediaLinkWithIdSchema>;
