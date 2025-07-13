import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  fullNameSearchSchemas,
  userProfileDeleteArrayDataBodySchema,
  userProfileFieldUpdateSchema,
  userProfilePictureUpdateSchema,
  userProfileUpdateArrayDataBodySchema,
} from '../schemas/profile.js';
import attachUser from '../middleware/attachUser.middleware.js';
import { userProfileParamsSchema } from '../schemas/profile.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

// Public routes
router.get(
  '/:identifier',
  validateSchema(userProfileParamsSchema),
  attachUser, // User or null, authentication is'nt required.
  ProfileController.getUserProfile,
);
router.get(
  '/fetch-profiles-by-names',
  validateSchema(fullNameSearchSchemas),
  ProfileController.fullNameSearch,
);

// Protected routes
router.get('/', auth, ProfileController.getSignedInUserProfileSummary);
router.patch(
  '/add-array-item',
  validateSchema(userProfileUpdateArrayDataBodySchema),
  auth,
  ProfileController.addArrayItem,
);
router.patch(
  '/update-field',
  validateSchema(userProfileFieldUpdateSchema),
  auth,
  ProfileController.updateProfileField,
);
router.delete(
  '/remove-array-item',
  validateSchema(userProfileDeleteArrayDataBodySchema),
  auth,
  ProfileController.removeArrayItem,
);
router.patch(
  '/update-profile-image',
  auth,
  upload.single('profilePicture'),
  validateSchema(userProfilePictureUpdateSchema),
  ProfileController.updateProfilePicture,
);

export default router;
