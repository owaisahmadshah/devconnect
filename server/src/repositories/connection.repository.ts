import type { TCreateConnection, TDeleteConnection, TUpdateConnection } from 'shared';
import { Connection } from '../models/connection.model.js';
import { Schema } from 'mongoose';

export class ConnectionRepository {
  createConnection(data: TCreateConnection) {
    return Connection.create(data);
  }

  updateConnection(data: TUpdateConnection) {
    return Connection.findOneAndUpdate(
      { _id: data.connectionId },
      { state: data.state },
      { new: true },
    );
  }

  deleteConnection(data: TDeleteConnection) {
    return Connection.findByIdAndDelete(data.connectionId);
  }

  findPaginatedConnection({
    filter,
    cursor,
    limit,
  }: {
    filter: any;
    cursor: string | null;
    limit: number;
  }) {
    if (cursor) {
      filter.createdAt = new Date(cursor);
    }

    return Connection.aggregate([
      {
        $match: filter,
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'profiles',
          let: {
            sender: '$sender',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$sender'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                role: 1,
                profilePictureUrl: 1,
                bio: 1,
                profileUrls: 1,
                isVerified: 1,
              },
            },
          ],
          as: 'sender',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          let: {
            receiver: '$receiver',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$receiver'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                role: 1,
                profilePictureUrl: 1,
                bio: 1,
                profileUrls: 1,
                isVerified: 1,
              },
            },
          ],
          as: 'receiver',
        },
      },
      {
        $addFields: {
          sender: {
            $arrayElemAt: ['$sender', 0],
          },
          receiver: {
            $arrayElemAt: ['$receiver', 0],
          },
        },
      },
    ]);
  }

  findPaginatedPendingConnections({
    profileId,
    cursor,
    limit,
  }: {
    profileId: string;
    cursor: string | null;
    limit: number;
  }) {
    const profileObjectId = new Schema.Types.ObjectId(profileId);

    const filter: any = {
      receiver: profileObjectId,
      state: 'pending',
    };

    return this.findPaginatedConnection({ filter, cursor, limit });
  }

  findAcceptedConnections({
    profileId,
    cursor,
    limit,
  }: {
    profileId: string;
    cursor: string | null;
    limit: number;
  }) {
    const profileObjectId = new Schema.Types.ObjectId(profileId);

    const filter: any = {
      $or: [{ receiver: profileObjectId }, { sender: profileObjectId }],
      state: 'accepted',
    };

    return this.findPaginatedConnection({ filter, cursor, limit });
  }
}
