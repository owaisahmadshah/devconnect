import { Router } from 'express';

import { healthCheck } from '../controllers/health-check.controller.js';

const router = Router();

//* api/v1/health-check
router.route('/').get(healthCheck);

export default router;
