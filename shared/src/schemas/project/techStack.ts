import { z } from 'zod';

// Techstack schema: represents a tech stack
export const baseTechStackSchema = z.object({ tech: z.string() });

// For API request (create) - no _id
export const createTechStackSchema = baseTechStackSchema;

// For frontend and API responses
export const techStackWithIdSchema = baseTechStackSchema.extend({ _id: z.string() });

// For typescript types
export type TBaseTechStack = z.infer<typeof baseTechStackSchema>;
export type TCreateTechStack = z.infer<typeof createTechStackSchema>;
export type TTechStackWithId = z.infer<typeof techStackWithIdSchema>;
