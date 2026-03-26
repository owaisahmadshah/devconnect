import { NotificationRepository } from '../repositories/notification.repository.js';
import { NotificationService } from '../services/notification.service.js';
import { NotificationController } from '../controllers/notification.controller.js';
import { NotificationMapper } from '../mapper/notification.mapper.js';
import { profileRepository } from './profile.container.js';
import { organizationRepository } from './organization.container.js';
import { sseManager } from '../utils/SSEManager.js';

const notificationRepository = new NotificationRepository();
const notificationMapper = new NotificationMapper();
const notificationService = new NotificationService({
  repo: notificationRepository,
  mapper: notificationMapper,
  profileRepo: profileRepository,
  organizationRepo: organizationRepository,
  sseManager: sseManager,
});

export const notificationController = new NotificationController(notificationService, sseManager);
export { notificationService };
