import type { Request, Response } from 'express';

import {
  HttpStatus,
  type TCreateConnection,
  type TDeleteConnection,
  type TUpdateConnection,
} from 'shared';
import type { ConnectionService } from '../services/connection.service.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

interface IConnectionControllerDeps {
  connectionService: ConnectionService;
}

export class ConnectionController {
  constructor(private deps: IConnectionControllerDeps) {}

  /**
   * Creates a new connection.
   *
   * @route POST /api/v1/connection/create
   *
   * @param {Request} req - Contains:
   *   - req.body: TCreateConnection
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TConnectionResponse>>} - Returns HTTP 201 Created on success
   *
   * @description
   * Creates a new connection in the database
   */
  createConnection = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    const connectionData: TCreateConnection = req.body;

    const connection = await this.deps.connectionService.createConnection({
      ...connectionData,
      sender: req.user.profileId,
    });

    return res
      .status(HttpStatus.CREATED)
      .json(new ApiResponse(HttpStatus.CREATED, connection, 'Created user successfully.'));
  });

  /**
   * Updates connection.
   *
   * @route PATCH /api/v1/connection/update
   *
   * @param {Request} req - Contains:
   *   - req.body: TUpdateConnection
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TConnectionResponse>>} - Returns HTTP 200 updated on success
   *
   * @description
   * Update connection in the database and returns it
   */
  updateConnection = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    const updateConnectionData: TUpdateConnection = req.body;

    const updatedConnection = await this.deps.connectionService.updateConnection(
      updateConnectionData,
    );

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, updatedConnection, 'Updated connection successfully.'));
  });

  /**
   * Deletes connection.
   *
   * @route DELETE /api/v1/connection/delete
   *
   * @param {Request} req - Contains:
   *   - req.body: TDeleteConnection
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TConnectionResponse>>} - Returns HTTP 200 deleted on success
   *
   * @description
   * delete connection in the database and returns it
   */
  deleteConnection = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    const data: TDeleteConnection = req.query as unknown as TDeleteConnection;

    const deletedConnection = await this.deps.connectionService.deleteConnection(data);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, deletedConnection, 'Deleted connection successfully.'));
  });

  /**
   * Returns Paginated pending connections.
   *
   * @route GET /api/v1/connection/pending-connection
   *
   * @param {Request} req - Contains:
   *   - req.user.profileId: profileId
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TConnectionResponseWithPagination>>} - Returns HTTP 200 on success
   *
   * @description
   * fetch paginated pending connections in the database and returns it
   */
  fetchPendingConnections = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    const { limit, cursor } = req.query;

    const connections = await this.deps.connectionService.fetchPendingConnections({
      profileId: req.user.profileId,
      limit: Number(limit),
      cursor: typeof cursor === 'string' ? cursor : null,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, connections, 'Fetch paginated connections successfully.'),
      );
  });

  /**
   * Returns Paginated accepted connections.
   *
   * @route GET /api/v1/connection/connection
   *
   * @param {Request} req - Contains:
   *   - req.user.profileId: profileId
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TConnectionResponseWithPagination>>} - Returns HTTP 200 on success
   *
   * @description
   * fetch paginated pending connections in the database and returns it
   */
  fetchAcceptedConnections = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    const { limit, cursor } = req.query;

    const connections = await this.deps.connectionService.fetchAcceptedConnections({
      profileId: req.user.profileId,
      limit: Number(limit),
      cursor: typeof cursor === 'string' ? cursor : null,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, connections, 'Fetch connections successfully.'));
  });
}
