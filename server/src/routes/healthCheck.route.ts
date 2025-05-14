import { Router } from 'express';

import { healthCheck } from '../controllers/healthCheck.controller.js';

const router = Router();

//* api/v1/health-check
router.route('/').get(healthCheck);

export default router;
