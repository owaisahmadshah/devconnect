import { CommentRepository } from '../repositories/comment.repository.js';
import { CommentService } from '../services/comment.service.js';
import { CommentController } from '../controllers/comment.controller.js';
import { CommentMapper } from '../mapper/comment.mapper.js';
import { profileService } from './profile.container.js';
import { notificationService } from './notification.container.js';

const commentMapper = new CommentMapper();

const commentRepository = new CommentRepository();

const commentService = new CommentService(commentRepository, commentMapper, profileService, notificationService);

const commentController = new CommentController(commentService);

export { commentMapper, commentRepository, commentService, commentController };
