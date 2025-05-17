import { Router } from 'express';
import { resendOtp, signInUser, signUpUser, verifyOtp } from '../controllers/user.controller.js';
import { authUserSchema, resendOtpSchema, signInUserSchema, verifyOtpSchema } from 'shared';
import { validateSchema } from '../middleware/validateRequest.middleware.js';

const router = Router();

// Public routes
router.post('/signup', validateSchema(authUserSchema), signUpUser);
router.post('/signin', validateSchema(signInUserSchema), signInUser);
router.post('/verify-otp', validateSchema(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', validateSchema(resendOtpSchema), resendOtp);

export default router;
