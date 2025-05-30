import { type FallbackProps } from 'react-error-boundary';
import {
  getErrorMessage,
  getErrorDetails,
  isUnauthorizedError,
  isNotFoundError,
  isValidationError,
} from '@/lib/errorHanldling';
import { Button } from './ui/button';

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const details = getErrorDetails(error);
  const message = getErrorMessage(error);

  let title = 'Something went wrong';
  let description = message;

  if (isNotFoundError(error)) {
    title = 'Not Found';
    description = 'The requested resource could not be found.';
  } else if (isUnauthorizedError(error)) {
    title = 'Unauthorized';
    description = 'You are not authorized. Please log in.';
  } else if (isValidationError(error)) {
    title = 'Validation Error';
    description = 'Please check your input.';
  }

  return (
    <div role="alert" className="mx-auto mt-10 max-w-md rounded-lg border p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2">{description}</p>

      {details.errors?.length > 0 && (
        <ul className="mt-4 list-inside list-disc text-sm">
          {details.errors.map((err, i: number) => (
            <li key={i}>{typeof err === 'string' ? err : err?.message || JSON.stringify(err)}</li>
          ))}
        </ul>
      )}

      <Button
        onClick={resetErrorBoundary}
        className="bg-card-foreground hover:bg-card-foreground mt-4 rounded px-4 py-2 text-sm font-medium transition"
      >
        Refresh page
      </Button>
    </div>
  );
}
