import { RefreshCw, AlertCircle } from 'lucide-react';
import { type FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import {
  getErrorDetails,
  isNotFoundError,
  isUnauthorizedError,
  isValidationError,
} from '@/lib/errorHanldling';

interface ErrorFallbackCompactProps extends FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Compact error fallback for use inside cards, panels, or page sections.
 * Adapts to available space without fixed heights.
 */
const ErrorFallbackCompact = ({ error, resetErrorBoundary }: ErrorFallbackCompactProps) => {
  const errorDetails = getErrorDetails(error);
  const isNotFound = isNotFoundError(error);
  const isUnauthorized = isUnauthorizedError(error);
  const isValidation = isValidationError(error);

  const getMessage = () => {
    if (isNotFound) return { title: 'Not found', description: "This resource doesn't exist." };
    if (isUnauthorized)
      return { title: 'Access denied', description: "You don't have permission to view this." };
    if (isValidation)
      return {
        title: 'Invalid request',
        description: errorDetails.message || 'Please check your input and try again.',
      };
    return {
      title: 'Something went wrong',
      description: errorDetails.message || 'An error occurred while loading this content.',
    };
  };

  const { title, description } = getMessage();
  const canRetry = !isNotFound && !isUnauthorized;

  return (
    <div className="border-border bg-muted/30 flex w-full flex-col items-center justify-center gap-3 rounded-lg border px-6 py-8 text-center">
      <AlertCircle className="text-muted-foreground/50 h-6 w-6" strokeWidth={1.5} />

      <div className="space-y-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">{description}</p>
      </div>

      {canRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetErrorBoundary}
          className="mt-1 h-7 text-xs"
        >
          <RefreshCw className="mr-1.5 h-3 w-3" />
          Try again
        </Button>
      )}
    </div>
  );
};

export default ErrorFallbackCompact;
