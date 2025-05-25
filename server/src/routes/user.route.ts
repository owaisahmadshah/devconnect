import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { ProfileController } from '../controllers/profile.controller.js';
import auth from '../middleware/auth.middleware.js';
import {
  forgetUserPassword,
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
} from '../schemas/user.js';

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

// Protected routes
router.get('/profile', auth, ProfileController.getSignedInUserProfileSummary);

export default router;
