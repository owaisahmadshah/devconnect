import axios from 'axios';
import { HttpStatus } from 'shared';
import { getErrorDetails } from './errorHanldling';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor — centralized error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const errorDetails = getErrorDetails(error);

    if (!originalRequest._retry) {
      originalRequest._retry = false;
    }

    if (
      (errorDetails.message === 'Unauthorized' ||
        errorDetails.message === 'Unauthorized: Invalid or expired token') &&
      errorDetails.statusCode === HttpStatus.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the access token via cookie
        await axios.post(`${BASE_URL}/api/v1/users/refresh-token`, {}, { withCredentials: true });

        // Retry the original request with updated credentials
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
