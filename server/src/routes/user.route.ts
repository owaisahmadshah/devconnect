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
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

// Public routes
router.post('/signup', validateSchema(authUserBodySchema), controller.signUpUser);
router.post('/signin', validateSchema(signInUserBodySchema), controller.signInUser);
router.post('/verify-otp', validateSchema(verifyOtpBodySchema), controller.verifyOtp);
router.post('/resend-otp', validateSchema(resendOtpBodySchema), controller.resendOtp);
router.post('/signout', auth, controller.signOutUser);
router.post('/forget-password', validateSchema(forgetPasswordBodySchema), controller.forgetUserPassword);
router.get(
  '/unique-identifier/:identifier',
  validateSchema(uniqueIdentifierParamsSchema),
  controller.uniqueIdentifier,
);
router.post('/refresh-token', controller.refreshAccessToken);

export default router;
