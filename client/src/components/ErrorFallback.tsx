import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { type FallbackProps } from 'react-error-boundary';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  getErrorDetails,
  isNotFoundError,
  isUnauthorizedError,
  isValidationError,
} from '@/lib/errorHanldling';

interface ErrorFallbackProps extends FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const router = useRouter();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const errorDetails = getErrorDetails(error);
  const isNotFound = isNotFoundError(error);
  const isUnauthorized = isUnauthorizedError(error);
  const isValidation = isValidationError(error);

  // Determine error type and styling
  const getErrorConfig = () => {
    if (isNotFound) {
      return {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved.",
        icon: <Home className="text-muted-foreground h-16 w-16" />,
        actionText: 'Go Home',
        showRetry: false,
        bgGradient:
          'from-blue-50 via-blue-25 to-indigo-50 dark:from-blue-950/10 dark:via-blue-950/5 dark:to-indigo-950/10',
        cardBorder: 'border-blue-200 dark:border-blue-800',
      };
    }

    if (isUnauthorized) {
      return {
        title: 'Access Denied',
        description:
          "You don't have permission to access this resource. Please sign in or contact support if you believe this is an error.",
        icon: <AlertTriangle className="text-destructive h-16 w-16" />,
        actionText: 'Sign In',
        showRetry: false,
        bgGradient:
          'from-red-50 via-red-25 to-orange-50 dark:from-red-950/10 dark:via-red-950/5 dark:to-orange-950/10',
        cardBorder: 'border-red-200 dark:border-red-800',
      };
    }

    if (isValidation) {
      return {
        title: 'Invalid Request',
        description:
          'There was an issue with your request. Please review the details below and try again.',
        icon: <Bug className="h-16 w-16 text-amber-500" />,
        actionText: 'Try Again',
        showRetry: true,
        bgGradient:
          'from-amber-50 via-amber-25 to-yellow-50 dark:from-amber-950/10 dark:via-amber-950/5 dark:to-yellow-950/10',
        cardBorder: 'border-amber-200 dark:border-amber-800',
      };
    }

    return {
      title: 'Something Went Wrong',
      description:
        'An unexpected error occurred. Our team has been notified and is working on a fix. Please try again in a few moments.',
      icon: <AlertTriangle className="text-destructive h-16 w-16" />,
      actionText: 'Try Again',
      showRetry: true,
      bgGradient:
        'from-red-50 via-red-25 to-pink-50 dark:from-red-950/10 dark:via-red-950/5 dark:to-pink-950/10',
      cardBorder: 'border-red-200 dark:border-red-800',
    };
  };

  const config = getErrorConfig();

  const handleGoHome = () => {
    router.navigate({ to: '/' });
  };

  const handleGoBack = () => {
    router.history.back();
  };

  const handleSignIn = () => {
    router.navigate({ to: '/auth/signin' });
  };

  const getActionHandler = () => {
    if (isUnauthorized) return handleSignIn;
    if (isNotFound) return handleGoHome;
    return resetErrorBoundary;
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gradient-to-br p-4 ${config.bgGradient}`}
    >
      <div className="w-full max-w-lg space-y-6">
        {/* Main Error Card */}
        <Card className={`bg-card/95 shadow-xl backdrop-blur-sm ${config.cardBorder}`}>
          <CardHeader className="space-y-6 pb-4 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-muted/50 rounded-full p-4">{config.icon}</div>
            </div>

            {/* Error Code Badge */}
            {errorDetails.statusCode && (
              <Badge variant="secondary" className="font-mono text-xs">
                Error {errorDetails.statusCode}
              </Badge>
            )}

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">{config.title}</h1>
              <p className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed">
                {config.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {errorDetails.message && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">{errorDetails.message}</AlertDescription>
              </Alert>
            )}

            {/* Validation Errors */}
            {isValidation && errorDetails.errors?.length > 0 && (
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                <Bug className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      Please fix the following issues:
                    </p>
                    <ul className="ml-2 space-y-1">
                      {errorDetails.errors.map((err, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300"
                        >
                          <span className="mt-0.5 text-xs text-amber-500">•</span>
                          <span>
                            {typeof err === 'string'
                              ? err
                              : err.message || 'Unknown validation error'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {config.showRetry && (
                <Button onClick={getActionHandler()} size="lg" className="w-full gap-2 font-medium">
                  <RefreshCw className="h-4 w-4" />
                  {config.actionText}
                </Button>
              )}

              {isUnauthorized && (
                <Button onClick={handleSignIn} size="lg" className="w-full gap-2 font-medium">
                  <Home className="h-4 w-4" />
                  {config.actionText}
                </Button>
              )}

              {isNotFound && (
                <Button onClick={handleGoHome} size="lg" className="w-full gap-2 font-medium">
                  <Home className="h-4 w-4" />
                  {config.actionText}
                </Button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleGoBack} variant="outline" size="default" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>

                <Button onClick={handleGoHome} variant="outline" size="default" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-auto w-full justify-between p-2 font-normal"
                  >
                    <span className="flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      Development Error Details
                    </span>
                    {isDetailsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-4 pt-4">
                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        Error Stack Trace
                      </h4>
                      <Card className="bg-muted/30">
                        <CardContent className="p-3">
                          <pre className="text-muted-foreground max-h-40 overflow-auto font-mono text-xs leading-relaxed">
                            {error.stack || error.message}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>

                    {errorDetails.errors?.length > 0 && (
                      <div>
                        <h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
                          <Bug className="h-3 w-3" />
                          API Error Details
                        </h4>
                        <Card className="bg-muted/30">
                          <CardContent className="p-3">
                            <pre className="text-muted-foreground max-h-32 overflow-auto font-mono text-xs leading-relaxed">
                              {JSON.stringify(errorDetails.errors, null, 2)}
                            </pre>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    <div>
                      <h4 className="text-foreground mb-2 text-sm font-semibold">Error Summary</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <Badge variant="outline" className="font-mono">
                            Status: {errorDetails.statusCode}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            Success: {errorDetails.success.toString()}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <Badge variant="outline">Not Found: {isNotFound.toString()}</Badge>
                          <Badge variant="outline">Unauthorized: {isUnauthorized.toString()}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
