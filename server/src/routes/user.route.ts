import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { ProfileController } from '../controllers/profile.controller.js';
import auth from '../middleware/auth.middleware.js';
import {
  forgetUserPassword,
  refreshAccessToken,
  resendOtp,
  signInUser,
  signOutUser,
  signUpUser,
  uniqueIdentifier,
  verifyOtp,
} from '../controllers/user.controller.js';
import {
  authUserBodySchema,
  forgetPasswordBodySchema,
  resendOtpBodySchema,
  signInUserBodySchema,
  uniqueIdentifierParamsSchema,
  verifyOtpBodySchema,
  userProfileParamsSchema,
} from '../schemas/user.js';
import attachUser from '../middleware/attachUser.middleware.js';

const router = Router();

// Public routes
router.post('/signup', validateSchema(authUserBodySchema), signUpUser);
router.post('/signin', validateSchema(signInUserBodySchema), signInUser);
router.post('/verify-otp', validateSchema(verifyOtpBodySchema), verifyOtp);
router.post('/resend-otp', validateSchema(resendOtpBodySchema), resendOtp);
router.post('/signout', auth, signOutUser);
router.post('/forget-password', validateSchema(forgetPasswordBodySchema), forgetUserPassword);
router.get(
  '/unique-identifier/:identifier',
  validateSchema(uniqueIdentifierParamsSchema),
  uniqueIdentifier,
);
router.post('/refresh-token', refreshAccessToken);
router.get(
  '/profile/:identifier',
  validateSchema(userProfileParamsSchema),
  attachUser, // User or null, authentication is'nt required.
  ProfileController.getUserProfile,
);

// Protected routes
router.get('/profile', auth, ProfileController.getSignedInUserProfileSummary);

export default router;
