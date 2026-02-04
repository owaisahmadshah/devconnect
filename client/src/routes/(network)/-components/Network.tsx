import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import { useInfiniteRecommendConnections } from '../-hooks/useRecommendConnections';
import { ConnectionsList } from './ConnectionList';
import ErrorFallback from '@/components/ErrorFallback';
import { NetworkNavbar } from './organisms/NetworkNavbar';
import { NetworkSkeleton } from './organisms/NetworkSkeleton';

export const Network = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<NetworkSkeleton />}>
      <ConnectionsList
        useInfiniteQuery={useInfiniteRecommendConnections}
        dataKey="profiles"
        header={
          <NetworkNavbar
            title="Recommended Connections"
            links={[
              { text: 'Connections', url: '/network/connections' },
              { text: 'Pending Connections', url: '/network/pendings' },
            ]}
          />
        }
      />
    </Suspense>
  </ErrorBoundary>
);
