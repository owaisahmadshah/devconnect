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

const router = Router();

router.post(
  '/create',
  auth,
  upload.fields([{ name: 'media', maxCount: 20 }]),
  validateSchema(createPostSchema),
  PostController.createPost,
);
router.delete('/delete', auth, validateSchema(deletePostQuerySchema), PostController.deleteProject);
// TODO: Check if 'validateSchema(postsOfUserParamsSchema), PostController.fetchPosts' is working for both 'feed' and 'posts of a user'
// Feed
router.get('/feed', auth, validateSchema(postsOfUserParamsSchema), PostController.fetchPosts); // Feed
// Posts of a user
router.get(
  '/user/:profileId',
  auth,
  validateSchema(postsOfUserParamsSchema),
  PostController.fetchPosts,
);
// A particular post by id
router.get('/post/:postId', auth, validateSchema(postByIdParamsSchema), PostController.fetchPost);

export default router;
