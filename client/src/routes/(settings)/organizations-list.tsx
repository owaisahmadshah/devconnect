import { createFileRoute } from '@tanstack/react-router';

import { OrganizationsList } from './-components/OrganizationsList';
import { requireAuth } from '@/lib/requireAuth';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback2 from '@/components/ErrorFallback2';
import { Suspense } from 'react';
import { OrganizationsListSkeleton } from './-components/skeletons/OrganizationsListSkeleton';

export const Route = createFileRoute('/(settings)/organizations-list')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback2}>
      <Suspense fallback={<OrganizationsListSkeleton />}>
        <OrganizationsList />
      </Suspense>
    </ErrorBoundary>
  );
}
