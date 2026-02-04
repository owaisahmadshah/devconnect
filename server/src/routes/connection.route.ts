import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';

import {
  connectionPaginatedRouteSchema,
  createConnectionRouteSchema,
  deleteConnectionRouteSchema,
  updateConnectionRouteSchema,
} from '../schemas/connection.js';

import { connectionController } from '../di/connection.container.js';

const router = Router();

router.post(
  '/create',
  auth,
  validateSchema(createConnectionRouteSchema),
  connectionController.createConnection,
);
router.patch(
  '/update',
  auth,
  validateSchema(updateConnectionRouteSchema),
  connectionController.updateConnection,
);
router.delete(
  '/delete',
  auth,
  validateSchema(deleteConnectionRouteSchema),
  connectionController.deleteConnection,
);
router.get(
  '/pending-connections',
  auth,
  validateSchema(connectionPaginatedRouteSchema),
  connectionController.fetchPendingConnections,
);
router.get(
  '/connections',
  auth,
  validateSchema(connectionPaginatedRouteSchema),
  connectionController.fetchAcceptedConnections,
);

export default router;
