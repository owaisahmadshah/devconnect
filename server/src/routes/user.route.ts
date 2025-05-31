import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
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
router.post('/refresh-token', refreshAccessToken);

export default router;
