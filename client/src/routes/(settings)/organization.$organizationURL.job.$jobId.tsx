import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { DisplayOneJob } from './-components/organisms/DisplayOneJob';
import { JobDetailCardSkeleton } from './-components/skeletons/JobDetailCardSkeleton';
import ErrorFallback2 from '@/components/ErrorFallback2';

export const Route = createFileRoute('/(settings)/organization/$organizationURL/job/$jobId')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback2}>
      <Suspense
        fallback={
          <div className="bg-background flex min-h-screen w-full flex-col items-center space-y-6 p-4 pt-6">
            <JobDetailCardSkeleton />
          </div>
        }
      >
        <DisplayOneJob />
      </Suspense>
    </ErrorBoundary>
  );
}
