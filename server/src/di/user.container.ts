import { startSession } from 'mongoose';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

import { UserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';
import { UserMapper } from '../mapper/user.mapper.js';

import sendEmail from '../utils/emailSender.js';
import { generateOTP, generateExpiryTime } from '../utils/generateOtpCodeAndExpiry.js';
import { Profile } from '../models/profile.model.js';

const userMapper = new UserMapper();

const userRepository = new UserRepository();

const userService = new UserService({
  repo: userRepository,
  userMapper,
  sendEmail,
  generateOTP,
  generateExpiryTime,
  startSession,
  profileModel: Profile,
  jwt,
  slugifyFn: slugify,
});
const userController = new UserController(userService);

export { userService, userController, userRepository };
