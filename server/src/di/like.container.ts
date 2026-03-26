import { LikeController } from '../controllers/like.controller.js';
import { LikeService } from '../services/like.service.js';
import { LikeRepository } from '../repositories/like.repository.js';
import { profileService } from './profile.container.js';
import { notificationService } from './notification.container.js';

const likeRepository = new LikeRepository();

const likeService = new LikeService(likeRepository, profileService, notificationService);

const likeController = new LikeController(likeService);

export { likeController, likeService, likeRepository };
