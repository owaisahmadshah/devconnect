import { createFileRoute } from '@tanstack/react-router';
import { OrganizationCard } from './-components/organisms/OrganizationCard';
import { requireAuth } from '@/lib/requireAuth';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback2 from '@/components/ErrorFallback2';
import { Suspense } from 'react';
import { OrganizationCardSkeleton } from './-components/skeletons/OrganizationCardSkeleton';

export const Route = createFileRoute('/(settings)/o/organization/$organizationURL')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback2}>
      <Suspense fallback={<OrganizationCardSkeleton />}>
        <OrganizationCard />
      </Suspense>
    </ErrorBoundary>
  );
}
