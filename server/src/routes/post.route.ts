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

import { postController } from '../di/post.container.js';

const router = Router();

router.post(
  '/create',
  auth,
  upload.fields([{ name: 'media', maxCount: 20 }]),
  validateSchema(createPostSchema),
  postController.createPost,
);
router.delete('/delete', auth, validateSchema(deletePostQuerySchema), postController.deleteProject);
// TODO: Check if 'validateSchema(postsOfUserParamsSchema), PostController.fetchPosts' is working for both 'feed' and 'posts of a user'
// Feed
router.get('/feed', auth, validateSchema(postsOfUserParamsSchema), postController.fetchPosts); // Feed
// Posts of a user
router.get(
  '/user/:profileId',
  auth,
  validateSchema(postsOfUserParamsSchema),
  postController.fetchPosts,
);
// A particular post by id
router.get('/post/:postId', auth, validateSchema(postByIdParamsSchema), postController.fetchPost);

export default router;
