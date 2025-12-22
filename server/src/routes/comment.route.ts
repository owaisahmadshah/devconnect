import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';

import {
  createCommentBodySchema,
  deleteCommentQuerySchema,
  postCommentsByIdQuerySchema,
} from '../schemas/comment.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';

import { commentController } from '../di/comment.container.js';

const router = Router();

router.post(
  '/create',
  auth,
  validateSchema(createCommentBodySchema),
  commentController.createComment,
);
router.delete(
  '/delete',
  auth,
  validateSchema(deleteCommentQuerySchema),
  commentController.deleteComment,
);
router.get(
  '/comments/:postId',
  auth,
  validateSchema(postCommentsByIdQuerySchema),
  commentController.fetchPaginatedComments,
);

export default router;
