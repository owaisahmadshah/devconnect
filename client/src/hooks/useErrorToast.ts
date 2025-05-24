import { useCallback } from 'react';
import { toast } from 'sonner';

import {
  isUnauthorizedError,
  isValidationError,
  getErrorDetails,
  getErrorMessage,
} from '@/lib/errorHanldling';

export const useErrorToast = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    const errorDetails = getErrorDetails(error);

    // Handle specific error types
    if (isUnauthorizedError(error)) {
      // Redirect to login or refresh token
      toast.error('Please log in again');
      // router.push('/login');
      return;
    }

    if (isValidationError(error)) {
      // Handle validation errors
      const validationMessages = errorDetails.errors.map(err => err.message).join(', ');
      toast.error(validationMessages || getErrorMessage(error));
      return;
    }

    // Generic error handling
    toast.error(errorDetails.message);

    // Log error for monitoring (in production, send to error tracking service)
    console.error(`${context || 'Application'} Error:`, errorDetails);
  }, []);

  return { handleError };
};
