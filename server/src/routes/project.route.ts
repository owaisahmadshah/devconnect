import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { ProjectController } from '../controllers/project.controller.js';
import * as projectSchema from '../schemas/project.js';
import { upload } from '../middleware/multer.middleware.js';
import { ProjectRepository } from '../repositories/project.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { ProfileService } from '../services/profile.service.js';
import { ProjectService } from '../services/project.service.js';

const router = Router();

const projectRepository = new ProjectRepository();
const profileRepository = new ProfileRepository();
const userRepository = new UserRepository();

const userService = new UserService(userRepository);
const profileService = new ProfileService(profileRepository, userService);
const projectService = new ProjectService(projectRepository, profileService);

const controller = new ProjectController(projectService);

// Protected routes
router.post(
  '/create',
  auth,
  upload.fields([{ name: 'media', maxCount: 15 }]),
  validateSchema(projectSchema.createProjectBodySchema),
  controller.createProject,
);
router.delete(
  '/delete',
  auth,
  validateSchema(projectSchema.deleteProjectQuerySchema),
  controller.deleteProject,
);
router.post(
  '/add-array-item',
  auth,
  validateSchema(projectSchema.addProjectArrayItemFieldBodySchema),
  controller.addArrayItem,
);
router.delete(
  '/delete-array-item',
  auth,
  validateSchema(projectSchema.deleteProjectArrayFieldItemQuerySchema),
  controller.deleteProjectArrayItem,
);
router.patch(
  '/update-field-item',
  auth,
  validateSchema(projectSchema.updateProjectItemFieldBodySchema),
  controller.updateProjectItemField,
);
router.get(
  '/by-title',
  validateSchema(projectSchema.projectsByTitleQuerySchema),
  controller.searchProjectByTitle,
);
router.get(
  '/by-techstack',
  validateSchema(projectSchema.projectsByTechStacksQuerySchema),
  controller.filterProjectsByTechStacks,
);
router.get(
  '/:projectId',
  validateSchema(projectSchema.projectByIdParamsSchema),
  controller.fetchProjectById,
);
router.get(
  '/user/:profileUrl',
  validateSchema(projectSchema.projectsOfUserParmsSchema),
  auth,
  controller.fetchUserProjectsByProfileUrls,
);

export default router;
