import ErrorFallback from '@/components/ErrorFallback';
import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
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
        <ProfileTemplate>
          <ProfileFeature identifier={identifier} />
        </ProfileTemplate>
      </Suspense>
    </ErrorBoundary>
  );
}
