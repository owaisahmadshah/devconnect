import { apiPost, apiGet, apiDelete } from '@/lib/api-client';

import type {
  TCreateOrganization,
  TDeleteOrganization,
  TOrganizationListResponseWithCursorPagination,
  TOrganizationResponse,
  TPagination,
} from 'shared';

export const createOrganizationService = async (data: TCreateOrganization) => {
  console.log('---------Data-------');
  console.log(data);
  return apiPost<TOrganizationResponse>('/api/v1/organizations/create', data);
};

export const deleteOrganizationService = async (params: TDeleteOrganization) => {
  return apiDelete<TOrganizationResponse>(`/api/v1/organizations/${params._id}`);
};

export const fetchUserOrganizationsService = async (query: TPagination) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>('/api/v1/organizations', query);
};

export const fetchOrganizationByIdService = async (pag_query: TPagination) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>(`/api/v1/organizations/`, pag_query);
};
