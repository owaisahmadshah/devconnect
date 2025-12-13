import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  createPostSchema,
  deletePostQuerySchema,
  postByIdParamsSchema,
  postsOfUserParamsSchema,
} from '../schemas/post.js';
import { PostController } from '../controllers/post.controller.js';
import { PostRepository } from '../repositories/post.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { ProfileService } from '../services/profile.service.js';
import { PostService } from '../services/post.service.js';

const router = Router();

const postRepository = new PostRepository();
const profileRepository = new ProfileRepository();
const userRepository = new UserRepository();

const userService = new UserService(userRepository);
const profileService = new ProfileService(profileRepository, userService);
const postService = new PostService(postRepository, profileService);

const controller = new PostController(postService, profileService);

router.post(
  '/create',
  auth,
  upload.fields([{ name: 'media', maxCount: 20 }]),
  validateSchema(createPostSchema),
  controller.createPost,
);
router.delete('/delete', auth, validateSchema(deletePostQuerySchema), controller.deleteProject);
// TODO: Check if 'validateSchema(postsOfUserParamsSchema), PostController.fetchPosts' is working for both 'feed' and 'posts of a user'
// Feed
router.get('/feed', auth, validateSchema(postsOfUserParamsSchema), controller.fetchPosts); // Feed
// Posts of a user
router.get(
  '/user/:profileId',
  auth,
  validateSchema(postsOfUserParamsSchema),
  controller.fetchPosts,
);
// A particular post by id
router.get('/post/:postId', auth, validateSchema(postByIdParamsSchema), controller.fetchPost);

export default router;
