import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  userProfileDeleteArrayDataBodySchema,
  userProfileUpdateArrayDataBodySchema,
} from '../schemas/profile.js';
import attachUser from '../middleware/attachUser.middleware.js';
import { userProfileParamsSchema } from '../schemas/profile.js';

const router = Router();

// Public routes
router.get(
  '/:identifier',
  validateSchema(userProfileParamsSchema),
  attachUser, // User or null, authentication is'nt required.
  ProfileController.getUserProfile,
);

// Protected routes
router.get('/', auth, ProfileController.getSignedInUserProfileSummary);
router.patch(
  '/add-array-item',
  validateSchema(userProfileUpdateArrayDataBodySchema),
  auth,
  ProfileController.addArrayItem,
);
router.delete(
  '/remove-array-item',
  validateSchema(userProfileDeleteArrayDataBodySchema),
  auth,
  ProfileController.removeArrayItem,
);

export default router;
