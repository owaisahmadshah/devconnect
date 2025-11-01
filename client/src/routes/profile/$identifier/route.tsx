import ErrorFallback from '@/components/ErrorFallback';
import ProfileLoader from '@/components/ProfileLoader';
import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
import { requireAuth } from '@/lib/requireAuth';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ProfileFeature } from '../-components/ProfileFeature';

export const Route = createFileRoute('/profile/$identifier')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  const { identifier } = Route.useParams();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<ProfileLoader />}>
        <ProfileTemplate>
          <ProfileFeature identifier={identifier} />
        </ProfileTemplate>
      </Suspense>
    </ErrorBoundary>
  );
}
