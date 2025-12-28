import { TUserProfileSummaryResponse } from '../profile/profileResponse';
import { TBaseConnection } from './connection';

export type TConnectionResponse = Omit<TBaseConnection, 'receiver'> & {
  _id: string;
  sender: TUserProfileSummaryResponse;
  receiver: TUserProfileSummaryResponse;
  createdAt: Date;
  updatedAt: Date;
};

export type TConnectionResponseWithPagination = {
  connections: TConnectionResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
