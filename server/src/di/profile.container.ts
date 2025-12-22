import mongoose from 'mongoose';

import { ProfileController } from '../controllers/profile.controller.js';
import { ProfileMapper } from '../mapper/profile.mapper.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { ProfileService } from '../services/profile.service.js';
import { userService } from './user.container.js';

import { uploadSingleImage } from '../utils/uploadImages.js';

const profileMapper = new ProfileMapper();

const profileRepository = new ProfileRepository();

const profileService = new ProfileService({
  repo: profileRepository,
  userService,
  profileMapper,
  uploadSingleImage,
  objectId: mongoose.Types.ObjectId,
});

const profileController = new ProfileController(profileService);

export { profileRepository, profileService, profileController };
