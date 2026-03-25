import { createFileRoute } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import { SharedPost } from './-components/SharedPost';
import { requireAuth } from '@/lib/requireAuth';
import { PostSkeleton } from '@/components/PostSkeleton';
import ErrorFallback from '@/components/ErrorFallback';

export const Route = createFileRoute('/post/p/$postId')({
  loader: requireAuth,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<PostSkeleton />}>
        <SharedPost />
      </Suspense>
    </ErrorBoundary>
  );
}
