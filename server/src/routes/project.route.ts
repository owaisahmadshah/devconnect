import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { ProjectController } from '../controllers/project.controller.js';
import * as projectSchema from '../schemas/project.js';

const router = Router();

// Protected routes
router.post(
  '/create',
  auth,
  validateSchema(projectSchema.createProjectBodySchema),
  ProjectController.createProject,
);
router.delete(
  '/delete',
  auth,
  validateSchema(projectSchema.deleteProjectQuerySchema),
  ProjectController.deleteProject,
);
router.post(
  '/add-array-item',
  auth,
  validateSchema(projectSchema.addProjectArrayItemFieldBodySchema),
  ProjectController.addArrayItem,
);
router.delete(
  '/delete-array-item',
  auth,
  validateSchema(projectSchema.deleteProjectArrayFieldItemQuerySchema),
  ProjectController.deleteProjectArrayItem,
);
router.patch(
  '/update-field-item',
  auth,
  validateSchema(projectSchema.updateProjectItemFieldBodySchema),
  ProjectController.updateProjectItemField,
);
router.get(
  '/by-title',
  validateSchema(projectSchema.projectsByTitleQuerySchema),
  ProjectController.searchProjectByTitle,
);
router.get(
  '/by-techstack',
  validateSchema(projectSchema.projectsByTechStacksQuerySchema),
  ProjectController.filterProjectsByTechStacks,
);
router.get(
  '/:projectId',
  validateSchema(projectSchema.projectByIdParamsSchema),
  ProjectController.fetchProjectById,
);
router.get(
  '/user/:profileId',
  validateSchema(projectSchema.projectsOfUserParmsSchema),
  auth,
  ProjectController.fetchUserProjects,
);

export default router;
