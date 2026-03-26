import type { ConnectionRepository } from '../repositories/connection.repository.js';
import {
  HttpStatus,
  type TCreateConnection,
  type TDeleteConnection,
  type TUpdateConnection,
  type TUserProfileWithConnection,
} from 'shared';
import type { ConnectionMapper } from '../mapper/connection.mapper.js';
import { ApiError } from '../utils/ApiError.js';
import type { NotificationService } from './notification.service.js';
import logger from '../utils/logger.js';

interface IConnectionServiceDeps {
  connectionRepository: ConnectionRepository;
  connectionMapper: ConnectionMapper;
  notificationService: NotificationService;
}

export class ConnectionService {
  constructor(private deps: IConnectionServiceDeps) {}

  async createConnection(data: TCreateConnection) {
    const { connectionRepository, connectionMapper, notificationService } = this.deps;

    data.state = 'pending';

    const connection = await connectionRepository.createConnection(data);

    const response = connectionMapper.toClientConnection(connection);

    notificationService
      .notifyConnectionRequest(data.sender as string, data.receiver, response._id)
      .catch(logger.error);

    return response;
  }

  async deleteConnection(data: TDeleteConnection) {
    const { connectionRepository, connectionMapper } = this.deps;
    const deletedConnection = await connectionRepository.deleteConnection(data);

    if (!deletedConnection) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Connection document not found.');
    }

    return connectionMapper.toClientConnection(deletedConnection);
  }

  async updateConnection(data: TUpdateConnection) {
    const { connectionRepository, connectionMapper, notificationService } = this.deps;

    const updatedConnection = await connectionRepository.updateConnection(data);

    if (!updatedConnection) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Connection not found.');
    }

    const response = connectionMapper.toClientConnection(updatedConnection);

    if (data.state === 'accepted') {
      notificationService
        .notifyConnectionAccepted(response.receiver, response.sender, response._id)
        .catch(logger.error);
    }

    return response;
  }

  async fetchPendingConnections({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: string | null;
  }): Promise<{
    connections: TUserProfileWithConnection[];
    hasMore: boolean;
    nextCursor: null | string;
  }> {
    const { connectionRepository } = this.deps;

    const pendingConnections = await connectionRepository.findPaginatedPendingConnections({
      profileId,
      limit,
      cursor,
    });

    return this.returnUserProfileWithConnectionsWithPagination(
      pendingConnections,
      limit,
      profileId,
    );
  }

  async fetchAcceptedConnections({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: string | null;
  }): Promise<{
    connections: TUserProfileWithConnection[];
    hasMore: boolean;
    nextCursor: null | string;
  }> {
    const { connectionRepository } = this.deps;

    const acceptedConnections = await connectionRepository.findAcceptedConnections({
      profileId,
      limit,
      cursor,
    });

    return this.returnUserProfileWithConnectionsWithPagination(
      acceptedConnections,
      limit,
      profileId,
    );
  }

  returnConnectionsWithPagination(dbConnections: any[], limit: number) {
    const { connectionMapper } = this.deps;

    const connections = dbConnections.map(connection =>
      connectionMapper.toClientConnection(connection),
    );

    const hasMore = connections.length === limit;
    const lastConnection = connections.at(-1);
    const nextCursor: string | null = lastConnection?.createdAt
      ? lastConnection.createdAt.toISOString()
      : null;

    return {
      connections,
      hasMore,
      nextCursor,
    };
  }

  returnUserProfileWithConnectionsWithPagination(
    dbConnections: any[],
    limit: number,
    profileId: string,
  ) {
    const { connectionMapper } = this.deps;

    const connections = dbConnections.map(connection =>
      connectionMapper.toClientProfileConnection(connection, profileId),
    );

    const hasMore = connections.length === limit;
    const lastConnection = dbConnections.at(-1);
    const nextCursor: string | null = lastConnection?.createdAt
      ? lastConnection.createdAt.toISOString()
      : null;

    return {
      connections,
      hasMore,
      nextCursor,
    };
  }
}
