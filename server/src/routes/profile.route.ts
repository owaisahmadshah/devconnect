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
import { ProfileRepository } from '../repositories/profile.repository.js';
import { ProfileService } from '../services/profile.service.js';
import { UserService } from '../services/user.service.js';
import { UserRepository } from '../repositories/user.repository.js';

const router = Router();

const repository = new ProfileRepository();
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const service = new ProfileService(repository, userService);
const controller = new ProfileController(service);

// Public routes
router.get(
  '/fetch-profiles-by-names',
  validateSchema(fullNameSearchSchemas),
  controller.fullNameSearch,
);
router.get(
  '/:url',
  validateSchema(userProfileParamsSchema),
  attachUser, // User or null, authentication is'nt required.
  controller.getUserProfile,
);

// Protected routes
router.get('/', auth, controller.getSignedInUserProfileSummary);
router.patch(
  '/add-array-item',
  validateSchema(userProfileUpdateArrayDataBodySchema),
  auth,
  controller.addArrayItem,
);
router.patch(
  '/update-field',
  validateSchema(userProfileFieldUpdateSchema),
  auth,
  controller.updateProfileField,
);
router.delete(
  '/remove-array-item',
  validateSchema(userProfileDeleteArrayDataBodySchema),
  auth,
  controller.removeArrayItem,
);
router.patch(
  '/update-profile-image',
  auth,
  upload.single('profilePicture'),
  validateSchema(userProfilePictureUpdateSchema),
  controller.updateProfilePicture,
);

export default router;
