import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { organizationMemberController } from '../di/organizationMember.container.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  createManyOrganizationMembersBodySchema,
  createOrganizationMemberBodySchema,
  createOrganizationMemberInviteSchema,
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
router.patch(
  '/update-role',
  auth,
  validateSchema(updateOrganizationMemberRoleBodySchema),
  organizationMemberController.updateOrganizationMemberRole,
);
router.get('/invitations', auth, organizationMemberController.organizationMemberInvitations);
router.post(
  '/invite',
  auth,
  validateSchema(createOrganizationMemberInviteSchema),
  organizationMemberController.createOrganizationMemberInvite,
);

export default router;
