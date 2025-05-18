import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { ProfileController } from '../controllers/profile.controller.js';

const router = Router();

// Protect route
router.get('/profile', auth, ProfileController.getSignedInUserProfileSummary);
