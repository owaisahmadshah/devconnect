import { TUserProfileSummaryResponse } from '../profile/profileResponse.js';
import { TBaseConnection, TConnectionPendingState } from './connection.js';

export type TConnectionResponse = Omit<TBaseConnection, 'sender'> & {
  _id: string;
  sender: string;
  state: TConnectionPendingState;
  createdAt: Date;
  updatedAt?: Date;
};

export type TUserProfileWithConnection = TUserProfileSummaryResponse;

export type TConnectionResponseWithPagination = {
  connections: TUserProfileWithConnection[];
  hasMore: boolean;
  nextCursor: string | null;
};
