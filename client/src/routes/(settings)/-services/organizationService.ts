import { apiPost, apiGet, apiDelete } from '@/lib/api-client';

import type {
  TCreateOrganization,
  TDeleteOrganization,
  TOrganizationListResponseWithCursorPagination,
  TOrganizationResponse,
  TPagination,
} from 'shared';

export const createOrganizationService = async (data: TCreateOrganization) => {
  return apiPost<TOrganizationResponse>('/api/v1/organizations/create', data);
};

export const deleteOrganizationService = async (params: TDeleteOrganization) => {
  return apiDelete<TOrganizationResponse>(`/api/v1/organizations/${params._id}`);
};

export const fetchUserOrganizationsService = async (query: TPagination) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>('/api/v1/organizations', query);
};

export const fetchOrganizationByIdOrURLService = async (
  { query }: { query: string },
  pag_query: TPagination,
) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>(
    `/api/v1/organizations/${query}`,
    pag_query,
  );
};
