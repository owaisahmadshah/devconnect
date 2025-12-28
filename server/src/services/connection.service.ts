import type { ConnectionRepository } from '../repositories/connection.repository.js';
import {
  HttpStatus,
  type TConnectionResponse,
  type TCreateConnection,
  type TDeleteConnection,
  type TUpdateConnection,
} from 'shared';
import type { ProfileService } from './profile.service.js';
import type { ConnectionMapper } from '../mapper/connection.mapper.js';
import { ApiError } from '../utils/ApiError.js';

interface IConnectionServiceDeps {
  connectionRepository: ConnectionRepository;
  connectionMapper: ConnectionMapper;
}

export class ConnectionService {
  constructor(private deps: IConnectionServiceDeps) {}

  async createConnection(data: TCreateConnection) {
    const { connectionRepository, connectionMapper } = this.deps;

    data.state = 'pending';

    const connection = await connectionRepository.createConnection(data);

    return connectionMapper.toClientConnection(connection);
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
    const { connectionRepository, connectionMapper } = this.deps;

    const updatedConnection = await connectionRepository.updateConnection(data);

    if (!updatedConnection) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Connection not found.');
    }

    return connectionMapper.toClientConnection(updatedConnection);
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
    connections: TConnectionResponse[];
    hasMore: boolean;
    nextCursor: null | string;
  }> {
    const { connectionRepository, connectionMapper } = this.deps;

    const pendingConnections = await connectionRepository.findPaginatedPendingConnections({
      profileId,
      limit,
      cursor,
    });

    return this.returnConnectionsWithPagination(pendingConnections, limit);
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
    connections: TConnectionResponse[];
    hasMore: boolean;
    nextCursor: null | string;
  }> {
    const { connectionRepository, connectionMapper } = this.deps;

    const acceptedConnections = await connectionRepository.findAcceptedConnections({
      profileId,
      limit,
      cursor,
    });

    return this.returnConnectionsWithPagination(acceptedConnections, limit);
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
}
