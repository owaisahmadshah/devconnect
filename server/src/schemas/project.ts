import { z } from 'zod';

import {
  createProjectBackendSchema,
  deleteProjectSchema,
  addProjectArrayItem,
  updateProjectFieldSchema,
  projectByIdSchema,
  projectByTitleSchema,
  projectByTechStackSchema,
  projectsOfUserSchema,
  paginationSchema,
  multipleBackendImagesSchema,
} from 'shared';

export const createProjectBodySchema = z.object({
  body: createProjectBackendSchema
    .omit({
      media: true,
      isFeatured: true,
    })
    .extend({ isFeatured: z.string() }),
  files: z.object({ media: multipleBackendImagesSchema }),
});

export const addProjectArrayItemFieldBodySchema = z.object({
  body: addProjectArrayItem,
});

export const updateProjectItemFieldBodySchema = z.object({
  body: updateProjectFieldSchema,
});

export const deleteProjectArrayFieldItemQuerySchema = z.object({
  query: deleteProjectSchema,
});

export const deleteProjectQuerySchema = z.object({
  query: deleteProjectSchema,
});

export const projectsByTitleQuerySchema = z.object({
  query: projectByTitleSchema.extend(paginationSchema.shape),
});

export const projectsByTechStacksQuerySchema = z.object({
  query: projectByTechStackSchema.extend(paginationSchema.shape),
});

export const projectByIdParamsSchema = z.object({
  params: projectByIdSchema,
});

export const projectsOfUserParmsSchema = z.object({
  params: projectsOfUserSchema,
  query: paginationSchema,
});
