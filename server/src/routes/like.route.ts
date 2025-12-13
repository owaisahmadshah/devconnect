import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { createLikeSchema } from '../schemas/like.js';
import { LikeController } from '../controllers/like.controller.js';
import { LikeService } from '../services/like.service.js';
import { LikeRepository } from '../repositories/like.repository.js';
import { ProfileService } from '../services/profile.service.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { UserService } from '../services/user.service.js';
import { UserRepository } from '../repositories/user.repository.js';

const router = Router();

const likeRepository = new LikeRepository();
const profileRepository = new ProfileRepository();
const userRepository = new UserRepository();

const userService = new UserService(userRepository);
const profileService = new ProfileService(profileRepository, userService);
const likeService = new LikeService(likeRepository, profileService);

const controller = new LikeController(likeService);

// Protected routes
router.post('/react', auth, validateSchema(createLikeSchema), controller.createLike);

export default router;
