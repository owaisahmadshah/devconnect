import { z } from 'zod';

// For api request to create a new project
export const createGithubProjectSchema = z.object({
  githubId: z.number(),
  githubName: z.string(),
});

export type TCreateGithubProject = z.infer<typeof createGithubProjectSchema>;
