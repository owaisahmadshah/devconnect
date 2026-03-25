import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  createOrganizationBodySchema,
  deleteOrganizationQuerySchema,
  organizationLogoUpdateSchema,
} from '../schemas/organization.js';

import { organizationController } from '../di/organization.container.js';
import auth from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

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
router.get('/:query', auth, organizationController.getOrganizationByIdOrURL);
router.get('/', auth, organizationController.getUserOrganizations);
router.get('/recommendations', auth, organizationController.findRecommendedOrganizationsForUser);
router.get('/search', auth, organizationController.searchOrganizations);
router.patch('/field/:organizationId', auth, organizationController.updateOrganizationField);
router.patch(
  '/logo/:organizationId',
  auth,
  upload.single('logo'),
  validateSchema(organizationLogoUpdateSchema),
  organizationController.updateOrganizationLogo,
);

export default router;
