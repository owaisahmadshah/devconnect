import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import { useFetchInfinitePendingConnections } from '../-hooks/useFetchInfinitePendingConnections';
import { ConnectionsList } from './ConnectionList';
import ErrorFallback from '@/components/ErrorFallback';

export const PendingConnections = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<div>Loading Pending Connections from Suspense...</div>}>
      <ConnectionsList
        useInfiniteQuery={useFetchInfinitePendingConnections}
        title="Pending Connections"
        dataKey="connections"
      />
    </Suspense>
  </ErrorBoundary>
);
