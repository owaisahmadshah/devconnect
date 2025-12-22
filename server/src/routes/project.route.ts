import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import * as projectSchema from '../schemas/project.js';

import auth from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

import { projectController } from '../di/project.container.js';

const router = Router();

// Protected routes
router.post(
  '/create',
  auth,
  upload.fields([{ name: 'media', maxCount: 15 }]),
  validateSchema(projectSchema.createProjectBodySchema),
  projectController.createProject,
);
router.delete(
  '/delete',
  auth,
  validateSchema(projectSchema.deleteProjectQuerySchema),
  projectController.deleteProject,
);
router.post(
  '/add-array-item',
  auth,
  validateSchema(projectSchema.addProjectArrayItemFieldBodySchema),
  projectController.addArrayItem,
);
router.delete(
  '/delete-array-item',
  auth,
  validateSchema(projectSchema.deleteProjectArrayFieldItemQuerySchema),
  projectController.deleteProjectArrayItem,
);
router.patch(
  '/update-field-item',
  auth,
  validateSchema(projectSchema.updateProjectItemFieldBodySchema),
  projectController.updateProjectItemField,
);
router.get(
  '/by-title',
  validateSchema(projectSchema.projectsByTitleQuerySchema),
  projectController.searchProjectByTitle,
);
router.get(
  '/by-techstack',
  validateSchema(projectSchema.projectsByTechStacksQuerySchema),
  projectController.filterProjectsByTechStacks,
);
router.get(
  '/:projectId',
  validateSchema(projectSchema.projectByIdParamsSchema),
  projectController.fetchProjectById,
);
router.get(
  '/user/:profileUrl',
  validateSchema(projectSchema.projectsOfUserParmsSchema),
  auth,
  projectController.fetchUserProjectsByProfileUrls,
);

export default router;
