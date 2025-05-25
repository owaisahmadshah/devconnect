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
  error => {
    // Log or handle specific error cases
    const errorDetails = getErrorDetails(error);
    if (
      errorDetails.statusCode === HttpStatus.UNAUTHORIZED &&
      errorDetails.message === 'Unauthorized'
    ) {
      // TODO: Request for another token
      console.error('Unauthorized, redirecting to login...');
    } else {
      console.log(errorDetails);
    }

    return Promise.reject(error);
  },
);

export default api;
