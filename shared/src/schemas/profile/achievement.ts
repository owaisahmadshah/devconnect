import { z } from 'zod';

// Achievement schema: details about achievements or awards
export const baseAchievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string(),
  date: z.coerce.date(),
  awardedBy: z.string().min(1, 'Awarded by is required'),
});

// For API request (create) - no _id
export const createAchievementSchema = baseAchievementSchema;

// For API request (update) - requires _id
export const updateAchievementSchema = baseAchievementSchema
  .omit({ title: true })
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
export const achievementWithIdSchema = baseAchievementSchema.extend({
  _id: z.string().min(1, '_id is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for typescript
export type TBaseAchievement = z.infer<typeof baseAchievementSchema>;
export type TCreateAchievement = z.infer<typeof createAchievementSchema>;
export type TUpdateAchievement = z.infer<typeof updateAchievementSchema>;
export type TAchievementWithId = z.infer<typeof achievementWithIdSchema>;
