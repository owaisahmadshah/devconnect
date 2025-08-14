/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AxiosRequestHeaders } from 'axios';

import api from './axios';
import { type ApiResponse } from './ApiResopnse';

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete';

interface RequestOptions {
  params?: any;
  data?: any;
  unwrapData?: boolean; // Optional: return just `data` or full ApiResponse
  signal?: AbortSignal;
  headers?: AxiosRequestHeaders;
}

/**
 * Generic request handler for all HTTP methods.
 * Automatically types and unwraps your API response.
 *
 * @param method - HTTP method to use (get, post, patch, etc.)
 * @param url - API endpoint URL
 * @param options - Optional body, query params, and unwrap toggle
 * @returns Typed response data or full API response depending on unwrapData
 *
 * @example
 * const project = await request<Project>('get', '/project/123');
 */
export const request = async <T, U extends boolean = true>(
  method: Method,
  url: string,
  options: RequestOptions & { unwrapData?: U } = {},
): Promise<U extends true ? T : ApiResponse<T>> => {
  const { params, data, unwrapData = true, signal, headers } = options;

  const defaultHeaders =
    data instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : data && !headers
        ? { 'Content-Type': 'application/json' }
        : undefined;

  const res = await api.request<ApiResponse<T>>({
    method,
    url,
    params,
    data,
    signal,
    headers: headers ?? defaultHeaders,
  });

  return (unwrapData ? res.data.data : res.data) as any;
};

/**
 * @example
 * const project = await apiGet<Project>('/project/123');
 */
export const apiGet = <T>(
  url: string,
  params?: any,
  options?: Omit<RequestOptions, 'params' | 'unwrapData'>,
  headers?: AxiosRequestHeaders,
) => request<T>('get', url, { params, ...options, headers });

/**
 * @example
 * const result = await apiPost<Project>('/project/create', { title: 'New' });
 */
export const apiPost = <T>(
  url: string,
  data?: any,
  options?: Omit<RequestOptions, 'unwrapData'>,
  headers?: AxiosRequestHeaders,
) => request<T>('post', url, { data, ...options, headers });

/**
 * @example
 * await apiPatch('/project/update', { id: '123', title: 'Updated' });
 */
export const apiPatch = <T>(
  url: string,
  data?: any,
  options?: Omit<RequestOptions, 'unwrapData'>,
  headers?: AxiosRequestHeaders,
) => request<T>('patch', url, { data, ...options, headers });

/**
 * @example
 * await apiDelete('/project/delete', { id: '123' });
 */
export const apiDelete = <T>(
  url: string,
  params?: any,
  options?: Omit<RequestOptions, 'params' | 'unwrapData'>,
  headers?: AxiosRequestHeaders,
) => request<T>('delete', url, { params, ...options, headers });
