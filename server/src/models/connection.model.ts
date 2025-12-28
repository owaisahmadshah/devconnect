import { Document, model, Schema } from 'mongoose';

import type { TBaseConnection } from 'shared';

interface IConnectionSchema extends Document, Omit<TBaseConnection, 'sender' | 'receiver'> {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
}

const connectionSchema = new Schema<IConnectionSchema>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  state: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

export const Connection = model<IConnectionSchema>('Connection', connectionSchema);
