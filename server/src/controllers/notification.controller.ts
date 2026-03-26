import type { Request, Response } from 'express';
import { HttpStatus } from 'shared';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import type { NotificationService } from '../services/notification.service.js';
import type { SSEManager } from '../utils/SSEManager.js';

export class NotificationController {
  constructor(
    private service: NotificationService,
    private sseManager: SSEManager,
  ) {}

  /**
   * Retrieves paginated notifications for the authenticated user.
   *
   * @route GET /api/v1/notifications
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.query.limit?: number
   *   - req.query.cursor?: string (ISO timestamp for cursor-based pagination)
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TNotificationSummaryResponseWithCursorBasedPagination>>}
   */
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { limit, cursor } = req.query;

    const notifications = await this.service.getNotifications({
      recipientId: req.user._id,
      limit: Number(limit) || 10,
      cursor: cursor ? String(cursor) : null,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, notifications, 'Fetched notifications successfully.'));
  });

  /**
   * Retrieves the unread notification count for the authenticated user.
   *
   * @route GET /api/v1/notifications/unread-count
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<{ count: number }>>}
   */
  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const count = await this.service.getUnreadCount(req.user._id);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, { count }, 'Fetched unread count successfully.'));
  });

  /**
   * Marks a specific notification as read.
   *
   * @route PATCH /api/v1/notifications/:notificationId/read
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.params.notificationId: string
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<ApiResponse<TNotificationSummaryResponse>>}
   */
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { notificationId } = req.params;

    const notification = await this.service.markAsRead(String(notificationId), req.user._id);

    return res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, notification, 'Notification marked as read.'));
  });

  /**
   * Marks all notifications as read for the authenticated user.
   *
   * @route PATCH /api/v1/notifications/read-all
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>}
   */
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    await this.service.markAllAsRead(req.user._id);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Deletes a specific notification.
   *
   * @route DELETE /api/v1/notifications/:notificationId
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user
   *   - req.params.notificationId: string
   *
   * @param {Response} res - Express response object
   *
   * @returns {Promise<void>}
   */
  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const { notificationId } = req.params;

    await this.service.deleteNotification(String(notificationId), req.user._id);

    return res.status(HttpStatus.NO_CONTENT).end();
  });

  /**
   * Opens an SSE connection for the authenticated user.
   *
   * @route GET /api/v1/notifications/sse
   *
   * @param {Request} req - Contains:
   *   - req.user: authenticated user (req.user.profileId used as key)
   *
   * @param {Response} res - Express response object (kept open)
   *
   * @description
   * Registers the client in SSEManager and holds the connection open.
   * Sends a heartbeat every 30 seconds to prevent connection timeout.
   * Cleans up on client disconnect.
   */
  connectSSE = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Authenticated user not found in request');
    }

    const profileId = req.user.profileId;

    // Required Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    this.sseManager.addClient(profileId, res);

    res.write(`data: ${JSON.stringify({ type: 'Connected', profileId })}\n\n`);

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      res.write(`: heartbead\n\n`);
    }, 30_000);

    req.on('close', () => {
      clearInterval(heartbeat);
      this.sseManager.removeClient(profileId);
    });
  });
}
