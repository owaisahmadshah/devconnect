import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';

import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { createLikeSchema } from '../schemas/like.js';

import { likeController } from '../di/like.container.js';

const router = Router();

router.post('/react', auth, validateSchema(createLikeSchema), likeController.createLike);

export default router;
