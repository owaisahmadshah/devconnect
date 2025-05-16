import { Router } from 'express';
import { signUpUser } from '../controllers/user.controller.js';
import { authUserSchema } from 'shared';
import { validateSchema } from '../middleware/validateRequest.middleware.js';

const router = Router();

// Public routes
router.post('/signup', validateSchema(authUserSchema), signUpUser);

export default router;
