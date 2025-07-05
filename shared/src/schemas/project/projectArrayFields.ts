import { z } from 'zod';
import { createCollaboratorSchema } from './collaborator';
import { createTagSchema } from './tag';
import { createTechStackSchema } from './techStack';

// For API request (update) - requires user _id, we'll get it from req.user and project _id we will provide with data
export const addProjectArrayItem = z.discriminatedUnion('fieldName', [
  z.object({
    fieldName: z.literal('collaborators'),
    projectId: z.string().min(1, 'Project _id is required.'),
    fieldData: createCollaboratorSchema,
  }),
  z.object({
    fieldName: z.literal('tags'),
    projectId: z.string().min(1, 'Project _id is required.'),
    fieldData: createTagSchema,
  }),
  z.object({
    fieldName: z.literal('techStacks'),
    projectId: z.string().min(1, 'Project _id is required.'),
    fieldData: createTechStackSchema,
  }),
]);

// For API request (delete)
export const deleteProjectArrayItem = z.discriminatedUnion('fieldName', [
  z.object({
    fieldName: z.literal('collaborators'),
    projectId: z.string().min(1, 'Project _id is required.'),
    deleteObjectId: z.string().min(1, 'Deleting object _id is required'),
  }),
  z.object({
    fieldName: z.literal('tags'),
    projectId: z.string().min(1, 'Project _id is required.'),
    deleteObjectId: z.string().min(1, 'Deleting object _id is required'),
  }),
  z.object({
    fieldName: z.literal('media'),
    projectId: z.string().min(1, 'Project _id is required.'),
    deleteObjectId: z.string().min(1, 'Deleting object _id is required'),
  }),
  z.object({
    fieldName: z.literal('techStacks'),
    projectId: z.string().min(1, 'Project _id is required.'),
    deleteObjectId: z.string().min(1, 'Deleting object _id is required'),
  }),
]);

// For typescript types
export type TAddProjectArrayItem = z.infer<typeof addProjectArrayItem>;
export type TDeleteProjectArrayItem = z.infer<typeof deleteProjectArrayItem>;
