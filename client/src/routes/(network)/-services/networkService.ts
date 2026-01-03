import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api-client';

import {
  type TConnectionResponseWithPagination,
  type TConnectionResponse,
  type TCreateConnection,
  type TDeleteConnection,
  type TPagination,
  type TUpdateConnection,
  type TUserProfileSummaryresponseWithPagination,
} from 'shared';

export const recommendConnections = async (query: TPagination) => {
  return apiGet<TUserProfileSummaryresponseWithPagination>(
    '/api/v1/profile/recommend-connections',
    query,
  );
};

export const createConnections = async (data: TCreateConnection) => {
  return apiPost<TConnectionResponse>('/api/v1/connection/create', data);
};

export const updateConnection = async (data: TUpdateConnection) => {
  return apiPatch<TConnectionResponse>('/api/v1/connection/update', data);
};

export const deleteConnection = async (data: TDeleteConnection) => {
  return apiDelete<TConnectionResponse>('/api/v1/connection/delete', data);
};

export const pendingConnections = async (query: TPagination) => {
  return apiGet<TConnectionResponseWithPagination>('/api/v1/connection/pending-connections', query);
};

export const connections = async (query: TPagination) => {
  return apiGet<TConnectionResponseWithPagination>('/api/v1/connection/connections', query);
};
