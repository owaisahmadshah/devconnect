import { ConnectionController } from '../controllers/connection.controller.js';
import { ConnectionMapper } from '../mapper/connection.mapper.js';
import { ConnectionRepository } from '../repositories/connection.repository.js';
import { ConnectionService } from '../services/connection.service.js';
import { notificationService } from './notification.container.js';

const connectionMapper = new ConnectionMapper();

const connectionRepository = new ConnectionRepository();

const connectionService = new ConnectionService({
  connectionRepository,
  connectionMapper,
  notificationService,
});

const connectionController = new ConnectionController({ connectionService });

export { connectionMapper, connectionRepository, connectionService, connectionController };
