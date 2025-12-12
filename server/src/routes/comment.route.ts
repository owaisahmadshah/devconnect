import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import {
  createCommentBodySchema,
  deleteCommentQuerySchema,
  postCommentsByIdQuerySchema,
} from '../schemas/comment.js';
import { CommentRepository } from '../repositories/comment.repository.js';
import { CommentService } from '../services/comment.service.js';
import { CommentController } from '../controllers/comment.controller.js';
import { CommentMapper } from '../mapper/comment.mapper.js';
import { ProfileService } from '../services/profile.service.js';

const router = Router();

const mapper = new CommentMapper();
const repo = new CommentRepository();
const profileService = new ProfileService();
const service = new CommentService(repo, mapper, profileService);
const controller = new CommentController(service);

router.post('/create', auth, validateSchema(createCommentBodySchema), controller.createComment);
router.delete('/delete', auth, validateSchema(deleteCommentQuerySchema), controller.deleteComment);
router.get(
  '/comments',
  auth,
  validateSchema(postCommentsByIdQuerySchema),
  controller.fetchPaginatedComments,
);

export default router;
