import { z } from 'zod';
import { projectVisibilityEnum } from './project.js';

// For API request (update) - requires _id, we'll get it from req.user
export const updateProjectFieldSchema = z
  .discriminatedUnion('fieldName', [
    z.object({
      fieldName: z.literal('title'),
      fieldData: z.string().min(1, 'Title is required'),
      projectId: z.string().min(1, 'Project _id is required'),
    }),
    z.object({
      fieldName: z.literal('description'),
      fieldData: z.string().min(1, 'Description is required.'),
      projectId: z.string().min(1, 'Project _id is required'),
    }),
    z.object({
      fieldName: z.literal('githubUrl'),
      fieldData: z.string(),
      projectId: z.string().min(1, 'Project _id is required'),
    }),
    z.object({
      fieldName: z.literal('liveDemoUrl'),
      fieldData: z.string(),
      projectId: z.string().min(1, 'Project _id is required'),
    }),
    z.object({
      fieldName: z.literal('isFeatured'),
      fieldData: z.boolean(),
      projectId: z.string().min(1, 'Project _id is required'),
    }),
    z.object({
      fieldName: z.literal('visibility'),
      fieldData: projectVisibilityEnum,
      projectId: z.string().min(1, 'Project _id is required'),
    }),
  ])
  .refine(data => !!data.fieldName, {
    message: 'At least one field must be provided for update',
  });

// For typesciprt types
export type TUpdateProjectField = z.infer<typeof updateProjectFieldSchema>;
