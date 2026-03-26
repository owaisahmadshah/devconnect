import { Router } from 'express';

import auth from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validateRequest.middleware.js';
import { deleteNotificationSchema, updateReadNotificationSchema } from '../schemas/notification.js';
import { notificationController } from '../di/notification.container.js';

const router = Router();

router.get('/sse', auth, notificationController.connectSSE);
router.get('/', auth, notificationController.getNotifications);
router.get('/unread-count', auth, notificationController.getUnreadCount);
router.patch('/read-all', auth, notificationController.markAllAsRead);
router.patch(
  '/:notificationId/read',
  auth,
  validateSchema(updateReadNotificationSchema),
  notificationController.markAsRead,
);
router.delete(
  '/:notificationId',
  auth,
  validateSchema(deleteNotificationSchema),
  notificationController.deleteNotification,
);

export default router;
