import ErrorFallback from '@/components/ErrorFallback';
import { ProfileFeature } from '@/features/profile/ProfileFeature';
import { requireAuth } from '@/lib/requireAuth';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const Route = createFileRoute('/profile/$identifier')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  const { identifier } = Route.useParams();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<p>⌛Loading profile...</p>}>
        <ProfileFeature identifier={identifier} />
      </Suspense>
    </ErrorBoundary>
  );
}
