import ErrorFallback from '@/components/ErrorFallback';
import { ProfileFeature } from '@/features/profile/ProfileFeature';
import { requireAuth } from '@/lib/requireAuth';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const Route = createFileRoute('/(user)/profile')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<p>⌛Loading profile...</p>}>
        <ProfileFeature />
      </Suspense>
    </ErrorBoundary>
  );
}
