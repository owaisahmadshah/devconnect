import { z } from 'zod';

// Collaborator schema: represents a collaborator
export const baseCollaboratorSchema = z.object({ user: z.string() });

// For API request (create) - no _id
export const createCollaboratorSchema = baseCollaboratorSchema;

// For frontend and API responses
export const collaboratorWithIdSchema = baseCollaboratorSchema.extend({ _id: z.string() });

// For typescript types
export type TBaseCollaborator = z.infer<typeof baseCollaboratorSchema>;
export type TCreateCollaborator = z.infer<typeof createCollaboratorSchema>;
export type TCollaboratorWithId = z.infer<typeof collaboratorWithIdSchema>;
