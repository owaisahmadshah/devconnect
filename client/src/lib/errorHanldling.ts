import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: any;
  success: boolean;
  errors: any[];
  stack?: string; // Only in development
}

// Type guard to check if error is an AxiosError with ApiErrorResponse
export const isApiError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    (error as AxiosError).response?.data &&
    typeof (error as AxiosError).response?.data === 'object' &&
    (error as AxiosError).response?.data !== null &&
    'statusCode' in ((error as AxiosError).response?.data as object)
  );
};

// Extract error message with fallbacks
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.response?.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occured.';
};

// Extract full error details
export const getErrorDetails = (error: unknown) => {
  if (isApiError(error)) {
    return {
      message: error.response?.data?.message || 'An error occurred',
      statusCode: error.response?.data?.statusCode || error.response?.status,
      errors: error.response?.data?.errors || [],
      success: false,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    statusCode: 500,
    errors: [],
    success: false,
  };
};

// Check specific error types
export const isNotFoundError = (error: unknown): boolean => {
  if (isApiError(error)) {
    return error.response?.data?.statusCode === 404;
  }
  return false;
};

export const isValidationError = (error: unknown): boolean => {
  if (isApiError(error)) {
    return (
      error.response?.data?.statusCode === 400 &&
      error.response?.data?.errors &&
      error.response?.data?.errors.length > 0
    );
  }
  return false;
};

export const isUnauthorizedError = (error: unknown): boolean => {
  if (isApiError(error)) {
    return error.response?.data?.statusCode === 401;
  }
  return false;
};
