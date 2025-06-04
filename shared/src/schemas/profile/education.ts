import { z } from 'zod';

// Education schema: details about educational background
export const baseEducationSchema = z.object({
  school: z.string().min(1, 'School name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  started: z.date(),
  ended: z.date(),
});

// For API request (create) - no _id
export const createEducationSchema = baseEducationSchema;

// For API request (update) - requries _id
export const updateEducationSchema = baseEducationSchema
  .pick({
    started: true,
    ended: true,
  })
  .partial()
  .extend({
    _id: z.string().min(1, '_id is required'),
  });

// For frontend and API response
export const educationWithIdSchema = baseEducationSchema.extend({
  _id: z.string().min(1, '_id is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for typescript
export type TBaseEducation = z.infer<typeof baseEducationSchema>;
export type TCreateEducation = z.infer<typeof createEducationSchema>;
export type TUpdateEducation = z.infer<typeof updateEducationSchema>;
export type TEducationWithId = z.infer<typeof educationWithIdSchema>;
