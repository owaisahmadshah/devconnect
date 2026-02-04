import { TUserProfileSummaryResponse } from '../profile/profileResponse';
import { TBaseConnection, TConnectionPendingState } from './connection';

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
