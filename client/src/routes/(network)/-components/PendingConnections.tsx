import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import { useFetchInfinitePendingConnections } from '../-hooks/useFetchInfinitePendingConnections';
import { ConnectionsList } from './ConnectionList';
import ErrorFallback from '@/components/ErrorFallback';
import { NetworkNavbar } from './organisms/NetworkNavbar';
import { NetworkSkeleton } from './organisms/NetworkSkeleton';

export const PendingConnections = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<NetworkSkeleton />}>
      <ConnectionsList
        useInfiniteQuery={useFetchInfinitePendingConnections}
        dataKey="connections"
        header={
          <NetworkNavbar
            title="Pending Connections"
            links={[
              { text: 'Connections', url: '/network/connections' },
              { text: 'Recommended Connections', url: '/network' },
            ]}
          />
        }
      />
    </Suspense>
  </ErrorBoundary>
);
