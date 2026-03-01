import { RefreshCw, Home, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { type FallbackProps } from 'react-error-boundary';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  getErrorDetails,
  isNotFoundError,
  isUnauthorizedError,
  isValidationError,
} from '@/lib/errorHanldling';

interface ErrorFallback2Props extends FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback2 = ({ error, resetErrorBoundary }: ErrorFallback2Props) => {
  const router = useRouter();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const errorDetails = getErrorDetails(error);
  const isNotFound = isNotFoundError(error);
  const isUnauthorized = isUnauthorizedError(error);
  const isValidation = isValidationError(error);

  const getErrorConfig = () => {
    if (isNotFound) return {
      code: '404',
      title: 'Page not found',
      description: "The page you're looking for doesn't exist or has been moved.",
      primaryAction: { label: 'Go home', handler: () => router.navigate({ to: '/' }) },
      showRetry: false,
    };
    if (isUnauthorized) return {
      code: '401',
      title: 'Access denied',
      description: "You don't have permission to view this resource.",
      primaryAction: { label: 'Sign in', handler: () => router.navigate({ to: '/auth/signin' }) },
      showRetry: false,
    };
    if (isValidation) return {
      code: '400',
      title: 'Invalid request',
      description: 'There was a problem with your request. Please review and try again.',
      primaryAction: { label: 'Try again', handler: resetErrorBoundary },
      showRetry: true,
    };
    return {
      code: '500',
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again in a moment.',
      primaryAction: { label: 'Try again', handler: resetErrorBoundary },
      showRetry: true,
    };
  };

  const config = getErrorConfig();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-10 text-center">

        {/* Error code */}
        <p className="text-[7rem] font-thin leading-none tracking-tighter text-muted-foreground/20 select-none">
          {config.code}
        </p>

        {/* Title & description */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{config.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>

          {/* Validation errors */}
          {isValidation && errorDetails.errors?.length > 0 && (
            <ul className="mt-4 space-y-1 text-left rounded-md border border-border bg-muted/40 px-4 py-3">
              {errorDetails.errors.map((err, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-destructive">–</span>
                  <span>{typeof err === 'string' ? err : err.message || 'Unknown error'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <Button onClick={config.primaryAction.handler} className="w-full max-w-xs">
            {config.showRetry && <RefreshCw className="mr-2 h-3.5 w-3.5" />}
            {!config.showRetry && <Home className="mr-2 h-3.5 w-3.5" />}
            {config.primaryAction.label}
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.history.back()} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Go back
            </Button>
            {!isNotFound && (
              <Button variant="ghost" size="sm" onClick={() => router.navigate({ to: '/' })} className="text-muted-foreground hover:text-foreground">
                <Home className="mr-1.5 h-3.5 w-3.5" />
                Home
              </Button>
            )}
          </div>
        </div>

        {/* Dev error details */}
        {process.env.NODE_ENV === 'development' && (
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground/60 hover:text-muted-foreground w-full">
                Debug details
                {isDetailsOpen ? <ChevronUp className="ml-1.5 h-3 w-3" /> : <ChevronDown className="ml-1.5 h-3 w-3" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-3 rounded-md border border-border bg-muted/40 p-4 text-left font-mono text-[11px] text-muted-foreground leading-relaxed overflow-auto max-h-48">
                {error.stack || error.message}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback2;