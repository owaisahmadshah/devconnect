import { z } from 'zod';
// Experience schema: work or project experience details
export const baseExperienceSchema = z.object({
  companyOrProject: z.string().min(1, 'Company or project name is required'),
  role: z.string().min(1, 'Role is required'),
  description: z.string(),
  type: z.enum(['Job', 'Internship', 'Freelance', 'Project']),
  location: z.string().or(z.literal('Remote')),
  started: z.coerce.date(),
  ended: z.coerce.date(),
  technologies: z.array(z.string()),
});

// For API request (create) - no _id
export const createExperienceSchema = baseExperienceSchema;

// For API request (update) - requires _id
export const updateExperienceSchema = baseExperienceSchema
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
export const experienceWithIdSchema = baseExperienceSchema.extend({
  _id: z.string().min(1, '_id is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for typescript
export type TBaseExperience = z.infer<typeof baseExperienceSchema>;
export type TCreateExperience = z.infer<typeof createExperienceSchema>;
export type TUpdateExperience = z.infer<typeof updateExperienceSchema>;
export type TExperienceWithId = z.infer<typeof experienceWithIdSchema>;
