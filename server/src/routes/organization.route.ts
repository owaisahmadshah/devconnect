import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  createOrganizationBodySchema,
  deleteOrganizationQuerySchema,
} from '../schemas/organization.js';

import { organizationController } from '../di/organization.container.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/create',
  auth,
  validateSchema(createOrganizationBodySchema),
  organizationController.createOrganization,
);
router.delete(
  '/:organizationId',
  auth,
  validateSchema(deleteOrganizationQuerySchema),
  organizationController.deleteOrganization,
);
router.get(
  '/:query',
  (req, res, next) => {
    console.log('---------Query /:query-------');
    next();
  },
  auth,
  organizationController.getOrganizationByIdOrURL,
);
router.get(
  '/',
  (req, res, next) => {
    console.log('---------Query /-------');
    next();
  },
  auth,
  organizationController.getUserOrganizations,
);

export default router;
