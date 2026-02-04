import { apiGet } from '@/lib/api-client';

import {
  type TConnectionResponseWithPagination,
  type TPagination,
  type TUserProfileSummaryresponseWithPagination,
} from 'shared';

export const recommendConnections = async (query: TPagination) => {
  return apiGet<TUserProfileSummaryresponseWithPagination>(
    '/api/v1/profile/recommend-connections',
    query,
  );
};

export const pendingConnections = async (query: TPagination) => {
  return apiGet<TConnectionResponseWithPagination>('/api/v1/connection/pending-connections', query);
};

export const connections = async (query: TPagination) => {
  return apiGet<TConnectionResponseWithPagination>('/api/v1/connection/connections', query);
};
