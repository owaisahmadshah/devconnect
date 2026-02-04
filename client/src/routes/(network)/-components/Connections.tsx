import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useInfiniteConnections } from '../-hooks/useFetchInfiniteConnections';
import { ConnectionsList } from './ConnectionList';
import ErrorFallback from '@/components/ErrorFallback';
import { NetworkNavbar } from './organisms/NetworkNavbar';
import { NetworkSkeleton } from './organisms/NetworkSkeleton';

export const Connections = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<NetworkSkeleton />}>
      <ConnectionsList
        useInfiniteQuery={useInfiniteConnections}
        dataKey="connections"
        header={
          <NetworkNavbar
            title="Connections"
            links={[
              { text: 'Recommended Connections', url: '/network' },
              { text: 'Pending Connections', url: '/network/pendings' },
            ]}
          />
        }
      />
    </Suspense>
  </ErrorBoundary>
);
