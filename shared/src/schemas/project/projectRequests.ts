import { z } from 'zod';

// Get project by Id
export const projectByProfileUrlSchema = z.object({
  url: z.string().min(1, 'Project ID is required'),
});

// Get project by title
export const projectByTitleSchema = z.object({
  title: z.string(),
});

// Get all projects of a particular user
export const projectsOfUserSchema = z.object({
  profileId: z.string(),
});

// Get project by tech stacks
export const projectByTechStackSchema = z.object({
  techStacks: z
    .union([
      z.string(), // for techStacks=react
      z.array(z.string()), // for techStacks[]=react&techStacks[]=node
    ])
    .transform(val => (Array.isArray(val) ? val : [val])),
});

// Types for typescript
export type TProjectByProfileUrl = z.infer<typeof projectByProfileUrlSchema>;
export type TProjectByTitle = z.infer<typeof projectByTitleSchema>;
export type TProjectsOfUser = z.infer<typeof projectsOfUserSchema>;
export type TProjectByTechStack = z.infer<typeof projectByTechStackSchema>;
