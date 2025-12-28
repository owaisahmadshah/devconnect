import type { TBaseConnection, TConnectionResponse } from 'shared';
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
}
