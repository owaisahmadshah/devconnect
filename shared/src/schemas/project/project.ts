import { z } from 'zod';
import { baseCollaboratorSchema, createCollaboratorSchema } from './collaborator';
import { baseTagSchema, createTagSchema, tagWithIdSchema } from './tag';
import { baseMediaSchema, mediaWithIdSchema } from './media';
import { baseTechStackSchema, createTechStackSchema, techStackWithIdSchema } from './techStack';
import { multipleBackendImagesSchema, multipleImagesSchema } from '../image/image';

export const projectVisibilityEnum = z.enum(['Private', 'Public', 'connections-only']);

// Base Project Schema: All pieces of project together
export const baseProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required.'),
  description: z.string().min(1, 'Project description is required.'),
  githubUrl: z.string(),
  liveDemoUrl: z.string(),
  createdBy: z.string().min(1, 'Project creator is required.'),
  isFeatured: z.boolean(),
  creationDate: z.coerce.date(),
  visibility: projectVisibilityEnum,
  collaborators: z.array(baseCollaboratorSchema),
  tags: z.array(baseTagSchema),
  media: z.array(baseMediaSchema),
  techStacks: z.array(baseTechStackSchema),
  github_repo_id: z.number().or(z.literal('')).optional(),
});

// For API request (create) - no _id needed
export const createProjectSchema = baseProjectSchema
  .omit({
    collaborators: true,
    tags: true,
    media: true,
    techStacks: true,
  })
  .extend({
    collaborators: z.array(createCollaboratorSchema),
    tags: z.array(createTagSchema),
    media: multipleImagesSchema,
    techStacks: z.array(createTechStackSchema),
  });

// For API request (create) - no _id needed
export const createProjectBackendSchema = createProjectSchema
  .omit({
    media: true,
  })
  .extend({
    media: multipleBackendImagesSchema,
  });

// For API request (delete) _id needed
export const deleteProjectSchema = z.object({
  _id: z.string(),
});

// For frontend and API response
export const projectWithIdSchema = baseProjectSchema
  .omit({
    collaborators: true,
    tags: true,
    media: true,
    techStacks: true,
  })
  .extend({
    _id: z.string(),
    collaborators: z.array(createCollaboratorSchema),
    tags: z.array(tagWithIdSchema),
    media: z.array(mediaWithIdSchema),
    techStacks: z.array(techStackWithIdSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  });

// For typescript types
export type TBaseProject = z.infer<typeof baseProjectSchema>;
export type TCreateProject = z.infer<typeof createProjectSchema>;
export type TCreateProjectBackend = z.infer<typeof createProjectBackendSchema>;
export type TProjectWithId = z.infer<typeof projectWithIdSchema>;
export type TDeleteProject = z.infer<typeof deleteProjectSchema>;
export type TProjectVisibilityEnum = 'Private' | 'Public' | 'connections-only';
