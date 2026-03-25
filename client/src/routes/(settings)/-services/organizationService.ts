import { apiPost, apiGet, apiDelete, apiPatch } from '@/lib/api-client';

import {
  type TCreateOrganization,
  type TDeleteOrganization,
  type TOrganizationListResponseWithCursorPagination,
  type TOrganizationResponse,
  type TPagination,
  type TUpdateOrganizationField,
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

export const fetchOrganizationByIdService = async (pag_query: TPagination) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>(`/api/v1/organizations/`, pag_query);
};

export const fetchOrganizationByURLService = async ({ query }: { query: string }) => {
  return apiGet<TOrganizationResponse>(`/api/v1/organizations/${query}`);
};

export const fetchRecommendedOrganizationsService = async (query: TPagination) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>(
    '/api/v1/organizations/recommendations',
    query,
  );
};

export const searchOrganizationService = async (query: { query: string } & TPagination) => {
  return apiGet<TOrganizationListResponseWithCursorPagination>('/api/v1/organizations/search', query);
};

export const updateOrganizationFieldService = async ({
  organizationId,
  field,
  value,
}: {
  organizationId: string;
} & TUpdateOrganizationField) => {
  return apiPatch<TOrganizationResponse>(`/api/v1/organizations/field/${organizationId}`, {
    field,
    value,
  });
};

export const updateOrganizationLogoService = async ({
  formData,
  organizationId,
}: {
  formData: FormData;
  organizationId: string;
}) => {
  return apiPatch<TOrganizationResponse>(`/api/v1/organizations/logo/${organizationId}`, formData);
};
