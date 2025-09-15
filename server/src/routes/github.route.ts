import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { GithubController } from '../controllers/github.controller.js';

const router = Router();

router.get('/connect', auth, GithubController.connectGithub);
router.get('/callback', auth, GithubController.githubCallback);
router.get('/repos', auth, GithubController.githubRepos);
router.post('/repo/add', auth, GithubController.addRepoProject);

export default router;
