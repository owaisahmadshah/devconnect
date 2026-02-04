import { apiDelete, apiPatch, apiPost } from "@/lib/api-client";
import type { TConnectionResponse, TCreateConnection, TDeleteConnection, TUpdateConnection } from "shared";

export const createConnections = async (data: TCreateConnection) => {
  return apiPost<TConnectionResponse>('/api/v1/connection/create', data);
};

export const updateConnection = async (data: TUpdateConnection) => {
  return apiPatch<TConnectionResponse>('/api/v1/connection/update', data);
};

export const deleteConnection = async (data: TDeleteConnection) => {
  return apiDelete<TConnectionResponse>('/api/v1/connection/delete', data);
};