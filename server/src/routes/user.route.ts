import { Router } from 'express';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import auth from '../middleware/auth.middleware.js';

import {
  authUserBodySchema,
  forgetPasswordBodySchema,
  resendOtpBodySchema,
  signInUserBodySchema,
  uniqueIdentifierParamsSchema,
  verifyOtpBodySchema,
} from '../schemas/user.js';

import { userController } from '../di/user.container.js';

const router = Router();

// Public routes
router.post('/signup', validateSchema(authUserBodySchema), userController.signUpUser);
router.post('/signin', validateSchema(signInUserBodySchema), userController.signInUser);
router.post('/verify-otp', validateSchema(verifyOtpBodySchema), userController.verifyOtp);
router.post('/resend-otp', validateSchema(resendOtpBodySchema), userController.resendOtp);
router.post('/signout', auth, userController.signOutUser);
router.post(
  '/forget-password',
  validateSchema(forgetPasswordBodySchema),
  userController.forgetUserPassword,
);
router.get(
  '/unique-identifier/:identifier',
  validateSchema(uniqueIdentifierParamsSchema),
  userController.uniqueIdentifier,
);
router.post('/refresh-token', userController.refreshAccessToken);
router.get('/google', userController.googleSignIn);
router.get('/google/callback', userController.googleSignInCallback);

export default router;
