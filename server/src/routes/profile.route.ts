import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';

import {
  fullNameSearchSchemas,
  userProfileDeleteArrayDataBodySchema,
  userProfileFieldUpdateSchema,
  userProfilePictureUpdateSchema,
  userProfileUpdateArrayDataBodySchema,
} from '../schemas/profile.js';
import { userProfileParamsSchema } from '../schemas/profile.js';

import attachUser from '../middleware/attachUser.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

import { profileController } from '../di/profile.container.js';

const router = Router();

// Public routes
router.get(
  '/fetch-profiles-by-names',
  validateSchema(fullNameSearchSchemas),
  profileController.fullNameSearch,
);
router.get(
  '/:url',
  validateSchema(userProfileParamsSchema),
  attachUser, // User or null, authentication is'nt required.
  profileController.getUserProfile,
);

// Protected routes
router.get('/', auth, profileController.getSignedInUserProfileSummary);
router.patch(
  '/add-array-item',
  validateSchema(userProfileUpdateArrayDataBodySchema),
  auth,
  profileController.addArrayItem,
);
router.patch(
  '/update-field',
  validateSchema(userProfileFieldUpdateSchema),
  auth,
  profileController.updateProfileField,
);
router.delete(
  '/remove-array-item',
  validateSchema(userProfileDeleteArrayDataBodySchema),
  auth,
  profileController.removeArrayItem,
);
router.patch(
  '/update-profile-image',
  auth,
  upload.single('profilePicture'),
  validateSchema(userProfilePictureUpdateSchema),
  profileController.updateProfilePicture,
);

export default router;
