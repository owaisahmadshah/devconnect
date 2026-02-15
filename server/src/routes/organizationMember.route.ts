import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { organizationMemberController } from '../di/organizationMember.container.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  createManyOrganizationMembersBodySchema,
  createOrganizationMemberBodySchema,
  deleteOrganizationMemberQuerySchema,
  updateOrganizationMemberRoleBodySchema,
} from '../schemas/organizationMember.js';

const router = Router();

router.post(
  '/create',
  auth,
  validateSchema(createOrganizationMemberBodySchema),
  organizationMemberController.createOrganizationMember,
);
router.delete(
  '/:organizationId/delete/:userId',
  auth,
  validateSchema(deleteOrganizationMemberQuerySchema),
  organizationMemberController.deleteOrganizationMember,
);
router.get(
  '/members/:organizationId',
  auth,
  organizationMemberController.findOrganizationAllMembers,
);
router.post(
  '/add-many',
  auth,
  validateSchema(createManyOrganizationMembersBodySchema),
  organizationMemberController.createManyOrganizationMembers,
);
router.put(
  '/update-role',
  auth,
  validateSchema(updateOrganizationMemberRoleBodySchema),
  organizationMemberController.updateOrganizationMemberRole,
);

export default router;
