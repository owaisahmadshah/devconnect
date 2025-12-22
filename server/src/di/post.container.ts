import { Types, startSession } from 'mongoose';

import { PostController } from '../controllers/post.controller.js';
import { PostRepository } from '../repositories/post.repository.js';
import { PostService } from '../services/post.service.js';
import { profileService } from './profile.container.js';
import { PostMapper } from '../mapper/post.mapper.js';

import { uploadMultipleImages } from '../utils/uploadImages.js';

const postMapper = new PostMapper();

const postRepository = new PostRepository();

const postService = new PostService({
  repo: postRepository,
  profileService,
  uploadMultipleImages,
  postMapper,
  startSession,
  objectId: Types.ObjectId,
});

const postController = new PostController(postService, profileService);

export { postRepository, postService, postController };
