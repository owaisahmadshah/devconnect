import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';

import { createLikeSchema } from '../schemas/like.js';

import { LikeController } from '../controllers/like.controller.js';

const router = Router();

router.post('/react', auth, validateSchema(createLikeSchema), LikeController.createLike);

export default router;
