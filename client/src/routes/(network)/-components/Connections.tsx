import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useInfiniteConnections } from '../-hooks/useFetchInfiniteConnections';
import { ConnectionsList } from './ConnectionList';
import ErrorFallback from '@/components/ErrorFallback';

export const Connections = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<div>Loading Connections from Suspense...</div>}>
      <ConnectionsList
        useInfiniteQuery={useInfiniteConnections}
        title="Connections"
        dataKey="connections"
      />
    </Suspense>
  </ErrorBoundary>
);
