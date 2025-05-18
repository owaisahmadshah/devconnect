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
  authUserSchema,
  forgetPasswordSchema,
  resendOtpSchema,
  signInUserSchema,
  signOutUserSchema,
  uniqueIdentifierSchema,
  verifyOtpSchema,
} from 'shared';

const router = Router();

// Public routes
router.post('/signup', validateSchema(authUserSchema), signUpUser);
router.post('/signin', validateSchema(signInUserSchema), signInUser);
router.post('/verify-otp', validateSchema(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', validateSchema(resendOtpSchema), resendOtp);
router.post('/signout', validateSchema(signOutUserSchema), signOutUser);
router.post('/forget-password', validateSchema(forgetPasswordSchema), forgetUserPassword);
router.get(
  '/unique-identifier/:identifier',
  validateSchema(uniqueIdentifierSchema),
  uniqueIdentifier,
);

// Protected routes
router.get('/profile', auth, ProfileController.getSignedInUserProfileSummary);

export default router;
