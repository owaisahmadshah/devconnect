import { createFileRoute } from '@tanstack/react-router';
import { SelectOrganizationForm } from './-components/SelectOrganizationForm';
import { requireAuth } from '@/lib/requireAuth';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback2 from '@/components/ErrorFallback2';
import { Suspense } from 'react';
import { SelectOrganizationSkeleton } from './-components/skeletons/SelectOrganizationSkeleton';

export const Route = createFileRoute('/(settings)/organization/select')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback2}>
      <Suspense fallback={<SelectOrganizationSkeleton />}>
        <SelectOrganizationForm />
      </Suspense>
    </ErrorBoundary>
  );
}
