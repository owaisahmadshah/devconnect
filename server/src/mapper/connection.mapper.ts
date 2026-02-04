import type { TBaseConnection, TConnectionResponse, TUserProfileWithConnection } from 'shared';
import { Document } from 'mongoose';

export class ConnectionMapper {
  toClientConnection(dbData: Document | TBaseConnection): TConnectionResponse {
    const data = dbData instanceof Document ? dbData.toObject() : dbData;

    return {
      _id: data._id.toString(),
      receiver: data.receiver,
      sender: data.sender,
      state: data.state,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  toClientProfileConnection(
    dbData: Document | TBaseConnection,
    userProfileId: string,
  ): TUserProfileWithConnection {
    const data = dbData instanceof Document ? dbData.toObject() : dbData;

    const ourUserIsSender = data.sender._id.toString() === userProfileId;
    const otherUser = ourUserIsSender ? data.receiver : data.sender;

    return {
      ...otherUser,
      connection: {
        _id: data._id,
        sender: data.sender._id,
        receiver: data.receiver._id,
        state: data.state,
      },
    };
  }
}
